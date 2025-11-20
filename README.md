# 💰 Finance Glance — Full Stack Web Application  
A modern, responsive, and secure **Finance Tracker App** built with **React + Vite**, **Node.js + Express**, and **PostgreSQL**, featuring JWT authentication, real-time dashboard analytics, and full CRUD operations for accounts and transactions.



---

## 🚀 Live Demo (Render Deployments)
**Frontend:** [https://your-frontend-url.onrender.com  ](https://finance-tracker-ashen-two.vercel.app/overview)
**Backend:** [https://your-backend-url.onrender.com ](https://finance-tracker-l3wq.onrender.com) 



---

# 📌 Features

### 🔐 Authentication
- User Registration & Login (JWT)
- Secure protected routes
- Logout and token reset
- Local storage token management

### 👤 User Profile
- View profile data
- Update personal information
- Change password (current → new)
- Country & currency selection

### 💳 Accounts (CRUD)
- Create new accounts
- Add money
- Transfer money between accounts
- View all user accounts
- Delete account (if implemented)

### 💰 Transactions
- Auto-log deposits/transactions
- Track transaction history
- Dashboard analytics
- Income vs Expense chart
- Recent transactions list

### 📊 Dashboard
- Total balance
- Total income
- Total expense
- Line chart (Recharts)
- Donut chart (Distribution)
- Last accounts used

### 🎨 UI & Design
- Fully responsive UI  
- TailwindCSS  
- Modern gradients, card UI, Bento UI  
- Smooth animations  
- Mobile-first layout

---

# 🧩 Tech Stack

### Frontend
- React.js (Vite)
- Zustand (global state)
- TailwindCSS
- React Hook Form
- Axios
- Recharts
- HeadlessUI (Combobox)
- React Hot Toast

### Backend
- Node.js + Express.js
- PostgreSQL  
- JWT Authentication  
- Bcrypt password hashing  
- CORS  
- pg (node-postgres driver)

---

# 🗂️ Folder Structure

finance-tracker/
│
-├── backend/
-│ ├── controllers/
-│ ├── middleware/
-│ ├── routes/
-│ ├── libs/
-│ ├── index.js
-│ └── package.json
-│
-├── frontend/
-│ ├── src/
-│ │ ├── components/
-│ │ ├── pages/
-│ │ ├── libs/
-│ │ ├── store.js
-│ │ └── App.jsx
-│ └── package.json
-│
-├── README.md
-└── API_DOCS.md

---

🛠 Backend Setup
cd backend
npm install

Create .env file:
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
NODE_ENV=development
PORT=5000

Start backend
npm run dev     # nodemon (dev)
npm start       # production

---

🎨 Frontend Setup
cd frontend
npm install


Create .env:

VITE_API_URL=http://localhost:5000/api


Start development server:

npm run dev

