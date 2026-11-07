# TI-Projekt

E-commerce web platform for firearms, ammunition, and shooting accessories.

Built as part of the *Internet Technologies* (Technologie Internetowe) academic coursework.

---

## Tech Stack

### Backend
- **Framework:** FastAPI
- **ORM & Database:** SQLModel (SQLAlchemy) & SQLite
- **Runtime:** Python 3.12
- **Testing & Static Analysis:** Pytest, Pyright (Strict type checking via `pyproject.toml`)

### Frontend
- **UI Library:** React 19
- **Routing:** React Router v7
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Linting:** ESLint

### CI / CD
- **Automation:** GitHub Actions (Automated tests, linting, and build verification)

---

## Project Structure

```text
├── .github/workflows/    # CI/CD automated validation pipelines
├── .vscode/              # Shared editor workspace settings (path mapping)
├── backend/              # FastAPI application, database models, and tests
└── frontend/             # React SPA (Vite, Tailwind, React Router)
```

---

## Core Features (Planned & In Progress)

- **Product Catalog:** Advanced filtering by firearm type, caliber, manufacturer, and technical specs.
- **Compliance & Legal Workflow:** Dedicated handling for permit verification and in-store pickup requirements for regulated items.
- **Cart & Orders:** Shopping basket, order summary, and reservation workflows.
- **Inventory Management:** Administrative controls for stock levels and product entries.

---

## Project Status & Roadmap

### Phase 1: Core Architecture & CI/CD
- [x] Monorepo workspace configuration & environment boundaries
- [x] Repository hygiene standards & tiered `.gitignore`
- [x] Automated CI pipeline (Pytest, ESLint, Vite build check)

### Phase 2: Product Catalog & Database Engine
- [ ] Relational schema design (Categories, Firearms, Ammunition, Accessories)
- [ ] Database seeding & migration tooling
- [ ] Product catalog REST API with parameter filtering (caliber, type, brand)
- [ ] Storefront browsing UI & responsive product grid

### Phase 3: Domain Compliance & Shopping Experience
- [ ] Shopping cart & local state persistence
- [ ] Regulated goods workflow (permit number validation & in-store pickup booking)
- [ ] Order placement & reservation pipeline

### Phase 4: Authentication, Administration & Deployment
- [ ] JWT-based user authentication & authorization
- [ ] Role-based access control (Customer vs. Store Staff / Admin)
- [ ] Inventory management dashboard for store staff
- [ ] Full-stack containerization (Docker & Docker Compose)

---

## Getting Started

### Prerequisites
- **Python 3.12+**
- **Node.js 20+** and **npm**

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```powershell
   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1

   # Windows (Git Bash) / Linux / macOS
   source venv/Scripts/activate
   # or on Unix: source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   Interactive API documentation (Swagger UI) will be available at `http://127.0.0.1:8000/docs`.

6. Run automated tests:
   ```bash
   pytest
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:5173`.

4. Run code validation:
   ```bash
   npm run lint
   npm run build
   ```

---

## Git Workflow & Repository Hygiene

- **Branching Strategy:** Feature branches cut from `develop` (`feat/*`, `chore/*`, `fix/*`).
- **Integration:** Pull Requests are squashed and merged into `develop`.
- **Quality Gates:** All PRs must pass automated CI checks (`pytest` and `npm run lint && npm run build`) before merging.

---

## License

This project is licensed under the [MIT License](LICENSE).