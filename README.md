<div align="center">
  <br />
  <h1>🧪 Secure Formulation VCS</h1>
  <p>
    <strong>Enterprise-Grade Version Control for Product Formulations & R&D Recipes</strong>
  </p>
  <p>
    <a href="https://github.com/varshini-botla/Secure-Formulation-VCS/stargazers"><img src="https://img.shields.io/github/stars/varshini-botla/Secure-Formulation-VCS?style=for-the-badge&color=yellow" alt="Stars"></a>
    <a href="https://github.com/varshini-botla/Secure-Formulation-VCS/network/members"><img src="https://img.shields.io/github/forks/varshini-botla/Secure-Formulation-VCS?style=for-the-badge&color=orange" alt="Forks"></a>
    <a href="https://github.com/varshini-botla/Secure-Formulation-VCS/issues"><img src="https://img.shields.io/github/issues/varshini-botla/Secure-Formulation-VCS?style=for-the-badge&color=red" alt="Issues"></a>
    <a href="https://github.com/varshini-botla/Secure-Formulation-VCS/blob/main/LICENSE"><img src="https://img.shields.io/github/license/varshini-botla/Secure-Formulation-VCS?style=for-the-badge&color=blue" alt="License"></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

<br/>

Welcome to **Secure Formulation VCS**, a next-generation platform engineered to bring software-like version control to physical product R&D. Track every ingredient change, manage strict approval workflows, and maintain a full audit trail for all your formulations.

Whether you're developing cosmetics, pharmaceuticals, or food & beverage recipes, Secure Formulation VCS provides the compliance, traceability, and collaborative power your team needs.

---

## ✨ Key Features

- **🌿 Branching & Versioning**: Version your recipes just like code. Never lose a previous iteration.
- **🛡️ Strict Audit Trails**: Automatically track who changed what, when, and why. Fully compliant-ready.
- **✅ Approval Workflows**: Built-in multi-stage review processes before any formulation reaches production.
- **📊 Ingredient Master Data**: Centralized ingredient database with real-time analytics and tracking.
- **⚡ Modern & Blazing Fast**: Built on an enterprise-ready tech stack delivering a seamless UX.

---

## 🏗️ Architecture & Tech Stack

Secure Formulation VCS is built with a decoupled frontend and backend, prioritizing scalability and developer experience:

- **Frontend (`/frontend`)**: A reactive, server-side rendered application built with **Next.js**, styled with **Tailwind CSS**, and utilizing **Shadcn UI** for beautiful, accessible components.
- **Backend (`/backend`)**: A robust, strictly-typed **NestJS** REST API ensuring enterprise-grade architecture.
- **Database**: **PostgreSQL** handles the relational complexity of formulation versioning, interfaced gracefully via **Prisma ORM**.
- **Infrastructure**: Containerized database management via **Docker Compose**.

---

## 🚀 Quick Start (Local Development)

Get the project running on your local machine in minutes.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Docker & Docker Compose

### 1. Start the Database
Spin up the local PostgreSQL database using Docker:
```bash
docker-compose up -d
```

### 2. Run the Backend
Navigate to the backend directory, push the database schema, and start the development server:
```bash
cd backend
npx prisma db push
npx prisma generate
npm run start:dev
```
> The API will be available at `http://localhost:3001`

### 3. Run the Frontend
In a new terminal, navigate to the frontend directory and start the Next.js app:
```bash
cd frontend
npm install
npm run dev
```
> The UI will be available at `http://localhost:3000`

---

## 📁 Project Structure

```text
secure-formulation-vcs/
├── backend/                  # NestJS API
│   ├── prisma/               # Database schemas & migrations
│   └── src/                  # Controllers, Services, & Modules
│       ├── approval/         # Approval workflow logic
│       ├── audit/            # Audit trail system
│       ├── auth/             # Authentication & Authorization
│       ├── formulation/      # Core VCS logic for recipes
│       └── ingredient/       # Ingredient master data
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (Dashboard, Auth, etc.)
│   │   ├── components/       # Reusable UI (Shadcn/Tailwind)
│   │   ├── lib/              # API clients & utilities
│   │   └── store/            # State management
└── docker-compose.yml        # Local database infrastructure
```

---

## 🤝 Contributing

We welcome contributions from the community! Whether you want to fix a bug, improve the documentation, or propose a new feature, your help is appreciated. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <i>Built with passion by the formulation engineering team.</i>
</div>
