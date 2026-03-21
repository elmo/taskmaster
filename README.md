
# TaskMaster: Rails 8 + React 

A modern, commerical-grade React on Rails task management application built to demonstrate the integration of Rails 8, React 18 (Javascript / TypeScript), and JWT-based Authentication.

### 🚀 Tech Stack
Backend: Ruby on Rails 8.0+ (API Mode)
Frontend: React 18, TypeScript, Tailwind CSS 4.0
Database: PostgreSQL or SQLite
Authentication: JWT (JSON Web Tokens) with Bcrypt
Tooling: Esbuild, Propshaft, Axios
Backend testing: Rspec 
Frontend testing: Vitest 

### 🏗️ Architectural Highlights
JWT Auth Bridge: A custom authentication flow where the Rails backend issues tokens upon login/registration, which are then managed by a persistent React state and Axios interceptors.

Type-Safe Frontend: Full TypeScript implementation of the UI layer, including shared interfaces for Todo and Auth types.

Tailwind 4 Integration: Utilizes the latest CSS-first configuration and @theme blocks for styling.

Consolidated Gatekeeper: A centralized authentication logic in App.tsx that manages the transition between protected routes and the auth splash screen.

### 🛠️ Getting Started
Prerequisites
Ruby 3.3.0+
Node.js 20+
PostgreSQL or SQLlite

### 🛠️ Installation
Clone the repository

git clone https://github.com/your-username/taskmaster.git
cd taskmaster
Install dependencies

bundle install
npm install

## 🔒 Local SSL Setup (Optional)

Out of the box, this app is runs in SSL mode. Yo do this, follow the instructions below:

#### 1. Install mkcert

```bash
brew install mkcert
brew install nss # For Firefox support
mkcert -install

```

#### 2. Environment variable (dotenv)
API_URL=https://127.0.0.1:3000

#### 3.Start the Server
bin/dev

### 4. Visit site

https://127.0.0.1:3000

#### 5. 📂 Project Structure

```
 app/
 ├── controllers/api/v1/    # API Endpoints (Todos, Auth, Users)
 ├── javascript/
 │   ├── components/        # React TSX components (Login, Register, TodoList)
 │   ├── utils/             # Axios configuration and API helpers
 │   └──  entrypoints/
 |        |__ App.jsx         Main React Entry Point
 ├── models/                # User and Todo ActiveRecord models
 └── assets/                # Tailwind 4 CSS and static assets
```

#### 🔒 Authentication Flow
Register/Login: User submits credentials to /api/v1/login or /api/v1/users.
Token Issuance: Rails validates and returns a JWT in the JSON response.
Persistence: The React frontend stores the token in localStorage.
Authorization: All subsequent requests include the Authorization: Bearer <token> header via a global Axios interceptor.

### 🧪 Testing the API
You can test the backend independently using curl or Postman:

#### CURL 

curl -X POST https://127:0.0.1:3000/api/v1/users \
     -H "Content-Type: application/json" \
     -d '{"user": {"email": "test@example.com", "password": "password123"}}'

#### CI 

bin/rake ci:all

#### TODO
exract into gem
graphql enpoint
