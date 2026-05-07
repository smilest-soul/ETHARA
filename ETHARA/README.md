<div align="center">
  <h1>ETHARA – Premium Project Management SaaS</h1>
  <p><strong>Enterprise-Grade Project & Task Management Platform</strong></p>
  <p>A modern full-stack SaaS application for managing projects, teams, and tasks with advanced analytics, Kanban workflows, role-based access control, and a premium UI experience.</p>
</div>

---

## 📖 Overview

**ETHARA** is a production-ready Project Management SaaS platform designed with a modern enterprise-grade UI and scalable full-stack architecture.

The platform enables teams to:
* **Create and manage projects** with a seamless interface.
* **Assign and track tasks** with rich contextual metadata.
* **Monitor project progress** using advanced visualization.
* **Collaborate** effectively with team members.
* **Manage workflows** using an interactive drag-and-drop Kanban board.
* **Analyze productivity** through dynamic dashboards.
* **Securely authenticate** users with Role-Based Access Control (RBAC).

The application is built using **React, Vite, Tailwind CSS, Framer Motion, Node.js, Express.js, and MongoDB Atlas**.

---

## ✨ Key Features

### 🔐 Authentication & Security
* JWT-based authentication
* Secure password hashing using `bcryptjs`
* Protected frontend and backend routes
* Persistent login sessions
* Role-Based Access Control (RBAC)

### 👥 Role-Based Access Control (RBAC)

**Admin Permissions**
* Create, edit, and delete projects
* Manage workspace members
* Assign tasks across teams
* View full analytics dashboard
* Manage all global workflows

**Member Permissions**
* View assigned projects
* Update assigned tasks
* Manage personal task progress via Kanban
* Access personal dashboard views

### 📋 Project Management
* Create and manage comprehensive workspaces
* Team collaboration and member assignment
* Project progress tracking
* Detailed project overview pages

### ✅ Task Management
* Create and assign actionable tasks
* Update task statuses (`Pending`, `In Progress`, `Completed`)
* **Priority Levels**: `Low`, `Medium`, `High`
* Due date tracking and overdue indicators
* Smooth Kanban drag-and-drop workflow management

### 📊 Dashboard & Analytics
* Dynamic tracking of: Total Projects, Total Tasks, Completed Tasks, Pending Tasks, Overdue Tasks
* Team productivity insights
* Visual analytics via `recharts` (Donut & Bar charts)
* Real-time recent activity timeline

### 🎨 Modern SaaS UI
* Stunning **Glassmorphism** effects
* Flowing **Aurora animated backgrounds**
* Responsive, mobile-first design
* High-performance **Framer Motion** layout animations
* Smooth page transitions and micro-interactions
* Premium dark, modern SaaS theme

---

## 🛠 Tech Stack

### Frontend
* **Core**: React.js 18, Vite
* **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
* **Animations**: Framer Motion
* **Routing & HTTP**: React Router DOM, Axios
* **Visualization**: Recharts
* **UI Utilities**: Lucide React Icons, React Hot Toast
* **Drag-and-Drop**: `@hello-pangea/dnd`

### Backend
* **Core**: Node.js, Express.js
* **Database**: MongoDB Atlas, Mongoose
* **Security**: JWT Authentication, `bcryptjs`, CORS
* **Config**: `dotenv`

---

## 📂 Folder Structure

```text
ETHARA/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI elements & backgrounds
│   │   ├── pages/            # Main application views
│   │   ├── context/          # React Context (Auth)
│   │   ├── utils/            # API client and helper functions
│   │   └── App.jsx           # Main routing configuration
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Route logic handlers
│   │   ├── middleware/       # Auth and Error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express router definitions
│   │   ├── utils/            # AutoSeeder logic
│   │   └── server.js         # Entry point
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## 💻 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/ETHARA.git
cd ETHARA
```

### 2. Install Dependencies
**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd ../frontend
npm install
```

### 3. Environment Variables
**Backend (`backend/.env`)**
Create a `.env` file inside the backend directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

**Frontend (`frontend/.env`)**
Create a `.env` file inside the frontend directory:
```env
VITE_API_URL=http://localhost:5001/api
```

### 4. MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster.
2. Create a database user and save the credentials.
3. Whitelist your IP Address (`0.0.0.0/0` for universal access).
4. Copy the connection string and place it in the backend `.env`.

### 5. Running the Application
**Start Backend**
```bash
cd backend
npm run dev
```
*Expected Output:*
```text
MongoDB Connected
Server running in development mode on port 5001
```

**Start Frontend**
```bash
cd frontend
npm run dev
```
*Expected Output:* The app runs on `http://localhost:5173`

---

## 🗝 Demo Credentials & Data

### Auto-Seeding System
The application features a smart `autoSeed.js` utility. **If you connect to an empty database, it will automatically populate** the entire platform with users, projects, tasks, and activity logs!

### Admin Account
* **Email:** `admin@test.com`
* **Password:** `admin123`

### Member Accounts
* `rahul@test.com` / `rahul123`
* `priya@test.com` / `priya123`
* `arjun@test.com` / `arjun123`

### Sample Projects (Auto-Generated)
1. **E-Commerce Platform**: Payment Integration, Authentication Module, Admin Dashboard.
2. **Cyber Security Dashboard**: Vulnerability Reports, JWT Security, Analytics.
3. **Social Media Platform**: Real-time Chat, Notifications, Community Features.

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Authenticate user & get JWT |
| `GET`  | `/api/auth/me` | Fetch current user data |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/projects` | Fetch all workspace projects |
| `POST` | `/api/projects` | Create new project |
| `GET`  | `/api/projects/:id` | Get single project |
| `PUT`  | `/api/projects/:id` | Update project |
| `DELETE`| `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/tasks` | Fetch tasks |
| `POST` | `/api/tasks` | Create new task |
| `PUT`  | `/api/tasks/:id` | Update entire task |
| `PATCH`| `/api/tasks/:id/status`| Update task status (drag & drop) |
| `DELETE`| `/api/tasks/:id` | Remove task |

---

## ☁️ Deployment Guide (Railway Monorepo)

Deploying both frontend and backend from a single GitHub repository.

### Backend Deployment
1. Push this entire project to GitHub.
2. Create a new **Railway Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. In Settings -> **Root Directory**, enter `/backend`.
5. In Variables, add:
   * `PORT=5001`
   * `MONGODB_URI=your_atlas_url`
   * `JWT_SECRET=your_secret`
   * `NODE_ENV=production`
6. Go to Networking and click **Generate Domain**.

### Frontend Deployment
1. In the same Railway Project, click **New** -> **GitHub Repo** and select your repo again.
2. In Settings -> **Root Directory**, enter `/frontend`.
3. In Variables, add:
   * `VITE_API_URL=<Your Backend Domain generated above>/api`
4. Under the Deploy tab -> **Custom Start Command**, enter:
   * `npm run preview -- --host 0.0.0.0 --port $PORT`
5. Generate a Domain in the Networking tab.
6. **Security Step**: Go back to your Backend variables and add `FRONTEND_URL=<Your Frontend Domain>` to secure CORS.

---

## 🚀 Future Enhancements
* Real-time Notifications via WebSockets
* Team Chat System integration
* File Attachments for tasks
* Calendar & Timeline Views
* Email Notifications
* AI Productivity Insights

---

## 🛡 Performance & Security Features
* **Optimized Rendering**: Lazy-loaded components and heavily optimized Vite builds.
* **Security Middleware**: Password hashing (`bcrypt`), JWT verification, protected API layers, and dynamic CORS origin validation.
* **Error Handling**: Graceful fallback UI elements and structured JSON API error responses.

---

## 👨‍💻 Contributors

**Developed By: Sai Pavan Rangu**
* Full Stack Development & UI/UX Architecture
* Backend API Development & Database Design
* Cloud Deployment & Infrastructure

---

## 📄 License
This project is licensed for educational and portfolio purposes.

> **Final Notes**
> ETHARA is designed as a modern enterprise-grade SaaS platform showcasing full-stack engineering, secure authentication, production deployment scaling, and premium UI/UX design. Ideal for portfolio showcasing and technical demonstrations.
