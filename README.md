# 💰 Finance Glance – Personal Expense Tracker

🚀 [Live Demo](https://finance-tracker-ashen-two.vercel.app/)  
📂 [GitHub Repository](https://github.com/Kudhan/finance-tracker)

---

## 📌 Overview

**Finance Glance** is a full-stack web application that allows users to efficiently track and manage their personal finances. From viewing real-time transaction summaries to managing multiple account types (Cash, Cards, Crypto, Stocks), users get full control over their income and expenses with visual insights and intuitive design.

This project was fully developed by me as part of my internship journey, using modern web technologies to ensure a responsive, secure, and seamless user experience.

---

## 🧠 Key Features

- 📊 Interactive dashboard with pie charts and transaction graphs
- 🔐 Secure user authentication with Firebase and JWT
- 🧾 Add, edit, and filter transactions by date and category
- 💼 Manage multiple account types (Cash, Cards, Crypto, Stocks)
- 💸 Transfer funds between internal accounts
- ⚙️ User settings for profile and password updates
- 📱 Fully responsive UI for desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Firebase Authentication
- React Icons

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- PostgreSQL

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 🔧 Setup Instructions

### 1. Clone the Repository

git clone https://github.com/Kudhan/finance-tracker.git
cd finance-tracker ``


2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add the following (replace with your actual keys):

env
Copy
Edit
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_firebase_app_id
4. Run the Development Server
bash
Copy
Edit
npm run dev
