# Finance Glance - Professional Personal Expense Tracker

![Finance Glance Banner](https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80)

**Finance Glance** is a modern, full-stack personal finance application designed to help you take control of your financial future. With a professional SaaS-grade UI, smart insights, and intuitive tracking, managing your money has never been this tailored and efficient.

## 🚀 Key Features

### 🌟 Professional Dashboard
- **Smart Financial Insights**: Get a real-time "Financial Health Score" (0-100) and personalized AI-driven advice based on your spending habits.
- **Savings Goal Tracker**: Set custom goals (e.g., "New Car", "Emergency Fund") and visualize your progress.
- **Interactive Charts**: Visualize income vs. expense trends and category breakdowns with beautiful doughnut and line charts.

### 💸 Comprehensive Transaction Management
- **Professional Data Table**: Filter transactions by date range and search with a powerful, sticky-header table interface.
- **Export Options**: Download your financial reports in **PDF** and **Excel (.xlsx)** formats for offline analysis.
- **Smart Categorization**: Automatically categorize expenses and track them against your budget.

### 💳 Account Management
- **Multi-Account Support**: Track balances across Bank Accounts, Credit Cards, Cash, and Crypto wallets.
- **Visual Cards**: Sleek, glass-morphic account cards with instant "Top Up" and management features.

### 🔐 Secure & Modern
- **Bank-Grade Security**: Built with industry-standard security practices (JWT, Bcrypt).
- **Modern UI/UX**: Fully responsive mobile-first design with a premium "Violet/Indigo" aesthetic.

## 🛠️ Tech Stack

**Frontend:**
- **React.js (Vite)**
- **Tailwind CSS** (Styling)
- **Recharts** (Data Visualization)
- **Zustand** (State Management)
- **React Hook Form & Zod** (Validation)
- **XLSX & jsPDF** (Data Export)

**Backend:**
- **Node.js & Express**
- **PostgreSQL** (Database)
- **JWT** (Authentication) & **Bcrypt**

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL Database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Kudhan/finance-tracker.git
    cd finance-tracker
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` folder:
    ```env
    DATABASE_URL=your_postgres_connection_string
    JWT_SECRET=your_secret_key
    NODE_ENV=development
    PORT=5000
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file in the `frontend` folder:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
    Start the client:
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:5173` to see the app in action.

## 📸 Screenshots

| Dashboard | Transactions |
|:---:|:---:|
| *Smart insights and visual analytics* | *Professional filtering and export* |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the generic MIT License.
