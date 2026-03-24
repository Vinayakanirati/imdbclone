# 🎬 FlixBase - Full-Stack IMDB Clone

FlixBase is a comprehensive movie discovery and review platform. It combines a Spring Boot backend, a MySQL database, and a React frontend, allowing administrators to import movies from the OMDB API and users to explore, rate, and review them.

---

## ✨ Features

*   **OMDB API Integration**: Admins can search the massive OMDB database for movie titles and import them instantly into the local database.
*   **Role-Based Access Control (RBAC)**: Secure actions using JSON Web Tokens (JWT). Admins manage the catalog and moderate reviews, while registered Users can post ratings and reviews.
*   **Interactive Movie Details**: Split-view UI built with React showcasing a beautifully blurred hero backdrop, plot summaries, and community discussions.
*   **Modern Premium UI**: Fully responsive frontend built with Tailwind CSS, featuring glassmorphism elements, micro-animations, and a sleek dark mode theme.

---

## 🛠️ Technology Stack

**Backend**
*   Java 17+
*   Spring Boot 3 (Web, Data JPA)
*   Spring Security & JJWT (JSON Web Token)
*   MySQL Database

**Frontend**
*   React.js (via Vite)
*   Tailwind CSS (v3 for custom configurations)
*   Axios (API communication)
*   React Router DOM (Client-side routing)
*   Lucide React (Icons)

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)
The application expects a local MySQL server running natively on port `3306`.
*   **Username**: `root`
*   **Password**: `1234`
*   Spring Boot (`createDatabaseIfNotExist=true`) will automatically generate the `moviedb` schema and all required tables upon starting.

### 2. Running the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
3. The server will start on `http://localhost:8085`.

### 3. Running the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node modules (if not done already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173`.

---

## 🔐 Default Credentials

Upon starting the backend for the first time, a `DatabaseSeeder` will automatically generate an administrator account for you to use.

*   **Role**: `ADMIN`
*   **Username**: `admin`
*   **Password**: `admin123`

You can use this account to access the **Admin Dashboard**, search the OMDB API, and import movies into the database!
