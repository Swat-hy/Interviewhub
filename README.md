g# InterviewHub

InterviewHub is a modern, responsive web application designed for students and professionals to share, discover, and moderate real-world technical and behavioral interview experiences. It offers structured timelines for interview rounds, real-time search queries, dynamic lateral filters, and a secure moderation workflow for administrators.

---

## Tech Stack

### Frontend
* **Core**: React.js (Vite), React Router Dom (v6)
* **Styling**: Tailwind CSS v4 (configured natively via `@theme` in `index.css`)
* **HTTP Client**: Axios (pre-configured with request interceptors for automated JWT authorization header injection)

### Backend
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Security**: JWT authentication, bcryptjs password hashing

---

## Project Structure

```text
Interviewhub/
├── .gitignore               # Root gitignore to protect environment secrets
├── README.md                # Project documentation (this file)
├── client/                  # Frontend React SPA
│   ├── src/
│   │   ├── components/      # Shared components (Navbar, ProtectedRoute)
│   │   ├── context/         # AuthContext session manager
│   │   ├── pages/           # Pages (Home, Login, Register, SearchHub, ExperienceDetails, UserDashboard)
│   │   └── utils/           # Global Axios API interceptor utility
│   ├── vite.config.js       # Vite bundler configuration (with Tailwind v4 engine plugin)
│   └── package.json
└── server/                  # Backend REST API Server
    ├── config/              # Database connection configuration
    ├── controllers/         # Endpoint business logic controllers
    ├── middleware/          # JWT authorization and Admin access verification middlewares
    ├── models/              # User and Experience Mongoose schemas
    ├── routes/              # Express routing paths
    ├── server.js            # Main Express application entryway
    └── package.json
```

---

## Environment Variables Setup

Create a `.env` file in the `server/` directory using the provided `server/.env.example` template:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/interviewhub
JWT_SECRET=your_super_secret_jwt_key
```

*Note: The root-level `.gitignore` prevents the `.env` file from ever being committed to version control.*

---

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or an atlas cloud connection string.

### 1. Setup Backend Server
Navigate into the `server` directory, install packages, and boot the server:
```bash
cd server
npm install
npm run start
```
The server will start running on `http://localhost:5000` and automatically establish a connection to your local MongoDB instance.

### 2. Setup Frontend client
Open a new terminal window, navigate into the `client` directory, install packages, and boot the Vite development server:
```bash
cd client
npm install
npm run dev
```
The client will start running locally (usually on `http://localhost:5173`).

---

## User Roles and Permissions

The application supports two user roles: `student` (default) and `admin`.

### Students
* Can register, log in, view approved interview experiences, and read detailed timeline guides.
* Can share new interview experiences (which will initially go into a `pending` status).
* Can delete their own submitted posts, toggle likes, and leave comments.

### Administrators
* Auto-flagged if the account email starts with `admin@` (e.g. `admin@gmail.com`) or if `role` is manually set to `admin` in the MongoDB collection.
* Gets access to the **Admin Operations Control Center** in their dashboard.
* Can fetch pending experiences, approve submissions (publishing them instantly to the search feed), or reject/delete inappropriate entries.

---

## API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new user |
| **POST** | `/api/auth/login` | Public | Log in user and generate JWT token |
| **GET** | `/api/auth/me` | Private | Retrieve logged-in user profile details |
| **POST** | `/api/experiences` | Private | Submit a new experience (pending approval) |
| **GET** | `/api/experiences` | Public | Fetch all approved interview experiences |
| **GET** | `/api/experiences/my` | Private | Fetch current user's submitted posts |
| **GET** | `/api/experiences/:id` | Public | Retrieve detailed breakdown by ID |
| **DELETE**| `/api/experiences/:id` | Private | Delete user's own interview experience |
| **POST** | `/api/experiences/:id/like` | Private | Toggle like on an experience |
| **POST** | `/api/experiences/:id/comment` | Private | Attach a text comment to an experience |
| **GET** | `/api/admin/pending` | Admin Only | Fetch experiences awaiting moderation |
| **PUT** | `/api/admin/approve/:id` | Admin Only | Approve and publish a pending log |
| **DELETE**| `/api/admin/reject/:id` | Admin Only | Reject and permanently remove a log |
