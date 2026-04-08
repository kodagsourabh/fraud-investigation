# Fraud Intelligence Dashboard

![Dashboard Preview](https://via.placeholder.com/1200x600?text=Fraud+Intelligence+Dashboard)

**Live Application:** [https://fraud-investigation.vercel.app/](https://fraud-investigation.vercel.app/)  
**Live API Endpoint:** [https://fraud-investigation.onrender.com/](https://fraud-investigation.onrender.com/)

A full-stack, data-dense financial fraud investigation platform engineered to ingest, analyze, and manage bulk transaction data. Inspired by institutional platforms like Morningstar, this application features a sharp, high-contrast, and responsive UI built for professional analysts.

*This project was specifically designed to demonstrate full-stack proficiency, database management, and domain understanding for roles similar to Full Stack Developer II at FTI Consulting.*

---

## 🎯 Features

*   **Bulk CSV Ingestion:** Upload large batches of mocked financial transactions natively via the UI.
*   **Algorithmic Anomaly Engine:** Transaction uploads pass through a simulated backend rule engine that flags statistically unlikely transfers (e.g., massive offshore wires, crypto exchanges) as anomalies.
*   **Case Review Pipeline:** Analysts can click on any flagged transaction to view its details, review system warnings, input custom investigation notes, and explicitly mark the case strictly as a "Confirmed Fraud" or "Cleared" anomaly.
*   **Morningstar Aesthetic:** The UI has been heavily customized specifically for high data density, featuring distinct color coding, zebra-striped data grids, and stark action boundaries (White & Red Corporate motif).

---

## 🛠️ Technology Stack

**Frontend:**
*   Framework: **Vue 3** (Composition API)
*   Build Tool: **Vite**
*   Styling: **Tailwind CSS**
*   Hosting: **Vercel**

**Backend:**
*   Runtime: **Node.js**
*   Framework: **Express.js**
*   Data Processing: **csv-parse**, **multer**
*   Hosting: **Render.com** (Web Service Environment)

**Database:**
*   Engine: **PostgreSQL** (Node `pg` pooling)
*   Hosting: **Neon.tech** Serverless Postgres

---

## 🚀 Running Locally

To run this application locally, you will need Node.js and a valid PostgreSQL connection string.

### 1. Database Setup
1. Create a free PostgreSQL database on Neon.tech.
2. In the `backend` folder, create a `.env` file.
3. Add your connection string:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

### 2. Backend Setup
Navigate into the backend directory, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```
*(The backend will automatically create the required `transactions` table upon successful startup).*

### 3. Frontend Setup
Navigate into the frontend directory, install dependencies, and start Vite:
```bash
cd frontend
npm install
npm run dev
```

### 4. Testing the Data Upload
You can find a strictly formatted simulation file named `demo_transactions.csv` at the root of the project. Use the **Ingest Data (CSV)** button in the UI to upload this file to see the anomaly engine populate the dashboard.
