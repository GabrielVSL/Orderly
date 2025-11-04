# dti Digital - Technical Challenge (Online Order System)

This repository contains the practical assessment for the DEV Internship. It is a fullstack application built with a Node.js/Express backend and a React/Vite frontend.

## 🗂️ Project Structure

This is a monorepo containing two separate applications:

* `/backend`: The Node.js (Express) REST API.
* `/frontend`: The React (Vite) client application.

Please see the instructions below for running each part.

---

## 🚀 How to Run the Application

You will need two separate terminals to run this project.

### 1. Backend Setup (Node.js + Express)

The backend server is responsible for serving data from the SQLite database.

1.  **Navigate to the backend:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Database Seeder (One Time):**
    This will create the `db.sqlite3` file in `/backend/database/` and populate it with initial product data.
    ```bash
    node src/seeders/seed.js
    ```

4.  **Run the Server (Dev Mode):**
    This starts the server on `http://localhost:3001` using `nodemon`.
    ```bash
    npm run dev
    ```

#### ✅ Verifying the Backend

To verify the backend is working, open your browser (or an API client) and go to:
`http://localhost:3001/api/products`

You should see a JSON array of the seeded products (burgers, fries, etc.).

---

### 2. Frontend Setup (React + Vite)

The frontend application is what the user sees. It consumes the backend API.

1.  **Open a new terminal.**
2.  **Navigate to the frontend:**
    ```bash
    cd frontend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the Client (Dev Mode):**
    This starts the React app on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

#### ✅ Verifying the Frontend

Open your browser and go to `http://localhost:5173`. You should see the basic "My E-commerce Site" skeleton page.

*(This section will be updated as frontend features are added).*