"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcrypt.hash('password123', 10);
    const rd = await prisma.department.upsert({
        where: { name: 'R&D' },
        update: {},
        create: { name: 'R&D' },
    });
    const qaDep = await prisma.department.upsert({
        where: { name: 'Quality Assurance' },
        update: {},
        create: { name: 'Quality Assurance' },
    });
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pharma.com' },
        update: {},
        create: {
            email: 'admin@pharma.com',
            password,
            firstName: 'System',
            lastName: 'Admin',
            role: client_1.Role.ADMIN,
            departmentId: rd.id,
        },
    });
    const scientist = await prisma.user.upsert({
        where: { email: 'scientist@pharma.com' },
        update: {},
        create: {
            email: 'scientist@pharma.com',
            password,
            firstName: 'Marie',
            lastName: 'Curie',
            role: client_1.Role.SCIENTIST,
            departmentId: rd.id,
        },
    });
    const qa = await prisma.user.upsert({
        where: { email: 'qa@pharma.com' },
        update: {},
        create: {
            email: 'qa@pharma.com',
            password,
            firstName: 'John',
            lastName: 'Doe',
            role: client_1.Role.QA,
            departmentId: qaDep.id,
        },
    });
    const ethanol = await prisma.ingredient.upsert({
        where: { code: 'ETH-001' },
        update: {},
        create: {
            name: 'Ethanol (99%)',
            code: 'ETH-001',
            unit: 'L',
            description: 'Used as solvent',
        },
    });
    const water = await prisma.ingredient.upsert({
        where: { code: 'WTR-001' },
        update: {},
        create: {
            name: 'Purified Water',
            code: 'WTR-001',
            unit: 'L',
            description: 'USP Grade',
        },
    });
    const aspirin = await prisma.ingredient.upsert({
        where: { code: 'ASP-500' },
        update: {},
        create: {
            name: 'Aspirin Powder',
            code: 'ASP-500',
            unit: 'kg',
            description: 'Active Pharmaceutical Ingredient',
        },
    });
    console.log('Seed data created successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map