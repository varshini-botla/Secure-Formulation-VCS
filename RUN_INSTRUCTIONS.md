# Run Instructions for Secure Formulation VCS

## Prerequisites

- **Node.js** (v20 or newer) and **npm** installed.
- **Docker** (for the PostgreSQL database) installed and running.
- **Git** installed (to clone the repo if needed).
- **pnpm** or **yarn** (optional, npm works fine).
- **Prisma CLI** (`npx prisma`) – will be installed automatically with the backend dependencies.

## 1. Clone the Repository (if you haven't already)

```bash
git clone https://github.com/varshini-botla/Secure-Formulation-VCS.git
cd Secure-Formulation-VCS
```

If you already have the project locally, just navigate to its root:

```bash
cd "C:/Users/botla/OneDrive/Desktop/INTERN PROJECT"
```

## 2. Start the PostgreSQL Database with Docker

The project ships a `docker-compose.yml` that runs a PostgreSQL container on **port 5433**.

```bash
# From the project root
docker compose up -d
```

Verify it is running:

```bash
docker ps   # you should see a container named internproject-db-1
```

## 3. Backend Setup (NestJS)

```bash
# From the project root
cd backend

# Install dependencies
npm install

# Reset and seed the database (only needed the first time or after schema changes)
# This will drop the existing schema, recreate it, and insert seed data.
 npx prisma db push --force-reset   # creates the schema
 npx prisma db seed                  # inserts admin, scientist, QA users, etc.

# Build the backend (optional – you can run in dev mode directly)
npm run build

# Start the backend in watch mode (development server)
npm run start:dev   # API will be available at http://localhost:3001
```

The backend uses the environment variables defined in `backend/.env`. The default config points to the Docker PostgreSQL instance:

```
DATABASE_URL="postgresql://postgres:password@localhost:5433/secure_vcs?schema=public"
JWT_SECRET="superserioussecretformula123"
PORT=3001
```

## 4. Frontend Setup (Next.js)

```bash
# From the project root
to the frontend directory
cd frontend

# Install dependencies
npm install

# Build the production bundle (optional – you can run dev server directly)
npm run build

# Start the development server
npm run dev   # UI will be available at http://localhost:3000
```

The frontend expects the backend API at `http://localhost:3001`. This URL is baked into `frontend/src/lib/api.ts`. If you change the backend port, update that file accordingly.

## 5. Verify the Application

1. Open a browser and go to **http://localhost:3000**.
2. Log in with one of the seeded accounts:
   - **Scientist**: `scientist@pharma.com` / `password123`
   - **QA**: `qa@pharma.com` / `password123`
   - **Admin**: `admin@pharma.com` / `password123`
3. Explore the dashboard, create formulations, submit for approval, and review the approval queue.
4. The backend logs (running in the terminal) will show request traces, and the database will persist data across restarts.

## 6. Running the End‑to‑End Test Script (optional)

A TypeScript script `backend/test_e2e_run.ts` performs a full backend flow verification.

```bash
cd backend
npx ts-node test_e2e_run.ts
```

If it outputs **SUCCESS**, the backend transactions, notifications, and audit logs are working correctly.

## 7. Stopping the Services

- **Frontend**: Press `Ctrl+C` in the terminal running `npm run dev`.
- **Backend**: Press `Ctrl+C` in the terminal running `npm run start:dev`.
- **Database**: Stop the Docker container:

```bash
docker compose down
```

## 8. Adding a New File to the Project (as you requested)

A sample file `SAMPLE_FILE.txt` has been created in the project root. You can edit it or add any other files you need.

---
**Tip**: The project uses **dark mode** styling with high‑contrast colors; if you encounter any visual issues, check `frontend/src/app/globals.css` where the theme variables are defined.

Enjoy building and extending Secure Formulation VCS!
