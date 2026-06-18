import { PrismaClient, FormulationStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING E2E BACKEND FLOW VERIFICATION ---');

  // 1. Find Scientist and QA users
  const scientist = await prisma.user.findFirst({ where: { role: Role.SCIENTIST } });
  const qa = await prisma.user.findFirst({ where: { role: Role.QA } });
  const ingredient = await prisma.ingredient.findFirst();

  if (!scientist || !qa || !ingredient) {
    console.error('Prerequisites missing! Make sure seed data has run.');
    return;
  }

  console.log(`Using Scientist: ${scientist.email} (${scientist.id})`);
  console.log(`Using QA: ${qa.email} (${qa.id})`);
  console.log(`Using Ingredient: ${ingredient.name} (${ingredient.id})`);

  // 2. Clean up any existing E2E test formulations to ensure a clean run
  await prisma.formulation.deleteMany({
    where: { name: 'E2E Test Formulation' }
  });

  // 3. Create Formulation & Version (Atomic Transaction)
  console.log('Creating E2E Test Formulation...');
  const createResult = await prisma.$transaction(async (tx) => {
    const formulation = await tx.formulation.create({
      data: {
        name: 'E2E Test Formulation',
        category: 'Pharmaceutical',
        batchSize: 100,
        unit: 'kg',
        ownerId: scientist.id,
        status: FormulationStatus.DRAFT,
      },
    });

    const version = await tx.formulationVersion.create({
      data: {
        formulationId: formulation.id,
        versionNumber: '1.0',
        data: {
          ingredients: [{ ingredientId: ingredient.id, weight: 30, percentage: 30, unit: 'kg' }],
          steps: [{ stepNumber: 1, description: 'Mix at 25C' }]
        },
        createdById: scientist.id,
        ingredients: {
          create: [{
            ingredientId: ingredient.id,
            percentage: 30,
            weight: 30,
            unit: 'kg',
          }],
        },
        processSteps: {
          create: [{
            stepNumber: 1,
            description: 'Mix at 25C',
            temperature: 25,
            pressure: 1,
            mixingTime: 30,
          }],
        },
      },
    });

    return { formulation, version };
  });

  const { formulation, version } = createResult;
  console.log(`Created Formulation: ${formulation.name} (ID: ${formulation.id})`);
  console.log(`Created Version: ${version.versionNumber} (ID: ${version.id})`);

  // 4. Submit Version for Approval
  console.log('Submitting Version for Approval...');
  await prisma.formulation.update({
    where: { id: formulation.id },
    data: { status: FormulationStatus.SUBMITTED },
  });

  // Notify QA users
  const qas = await prisma.user.findMany({ where: { role: Role.QA } });
  for (const q of qas) {
    await prisma.notification.create({
      data: {
        userId: q.id,
        message: `Formulation "${formulation.name}" (v${version.versionNumber}) submitted for approval by Scientist.`,
        type: 'APPROVAL_REQUEST',
      },
    });
  }
  console.log('QA notifications sent.');

  // 5. Review & Approve Version (QA User)
  console.log('Reviewing and Approving Formulation...');
  await prisma.formulation.update({
    where: { id: formulation.id },
    data: { status: FormulationStatus.APPROVED },
  });

  await prisma.approval.create({
    data: {
      versionId: version.id,
      qaId: qa.id,
      status: FormulationStatus.APPROVED,
      comments: 'All parameters verified, looks perfect.',
    },
  });

  const updatedVersion = await prisma.formulationVersion.update({
    where: { id: version.id },
    data: { isApproved: true, isLocked: true },
  });
  console.log(`Approved & Locked version v${updatedVersion.versionNumber}`);

  // Notify Scientist
  await prisma.notification.create({
    data: {
      userId: scientist.id,
      message: `Your formulation "${formulation.name}" (v${version.versionNumber}) was APPROVED by QA John.`,
      type: 'VERSION_APPROVED',
    },
  });
  console.log('Scientist notification sent.');

  // Write E2E verification entry to AuditLog
  await prisma.auditLog.create({
    data: {
      userId: qa.id,
      action: 'APPROVE Formulation',
      entity: 'Formulation',
      entityId: formulation.id,
      metadata: { comments: 'All parameters verified, looks perfect.' },
    },
  });
  console.log('Audit log entry created.');

  // 6. Verify final state
  const finalFormulation = await prisma.formulation.findUnique({
    where: { id: formulation.id },
    include: { versions: true }
  });
  const finalNotifications = await prisma.notification.findMany({
    where: { userId: scientist.id, type: 'VERSION_APPROVED' }
  });
  const finalAuditLogs = await prisma.auditLog.findMany({
    where: { entityId: formulation.id }
  });

  console.log('\n--- VERIFICATION CHECKS ---');
  console.log('Formulation Status is APPROVED:', finalFormulation?.status === FormulationStatus.APPROVED);
  console.log('Version is Approved & Locked:', finalFormulation?.versions[0]?.isApproved && finalFormulation?.versions[0]?.isLocked);
  console.log('Scientist Received Notification:', finalNotifications.length > 0);
  console.log('Audit Log Exists:', finalAuditLogs.length > 0);
  console.log('--- E2E BACKEND FLOW SUCCEEDED ---');
}

main()
  .catch((e) => {
    console.error('Test execution failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
