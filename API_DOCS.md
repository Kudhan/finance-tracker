📘 API Documentation — Finance Tracker

This document describes all API endpoints used by the Finance Tracker Web App, including authentication, user operations, account management, transactions, and dashboard data.

Base URL (Production):

https://your-backend.onrender.com/api


Base URL (Local):

http://localhost:5000/api

---

🔐 Authentication APIs
1. POST /auth/signup

Register a new user.

Request Body:
{
  "firstname": "Kudhan",
  "lastname": "Shaik",
  "email": "test@example.com",
  "password": "123456"
}

Success Response:
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "firstname": "Kudhan",
    "email": "test@example.com"
  },
  "token": "JWT_TOKEN_HERE"
}

2. POST /auth/login

Authenticate user and return JWT.

Request Body:
{
  "email": "test@example.com",
  "password": "123456"
}

Success Response:
{
  "status": "success",
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "firstname": "Kudhan",
    "email": "test@example.com"
  }
}


---

👤 User APIs

Authorization Required: Bearer <token>

3. GET /user

Fetch current logged-in user.

Response:
{
  "status": "success",
  "message": "User fetched successfully",
  "user": {
    "id": 1,
    "firstname": "Kudhan",
    "lastname": "Shaik",
    "email": "test@example.com",
    "country": "India",
    "currency": "IN"
  }
}

4. PUT /user

Update user profile.

Request Body:
{
  "firstname": "Kudhan",
  "lastname": "Shaik",
  "email": "updated@mail.com",
  "country": "India",
  "currency": "IN",
  "contact": "1234567890"
}

Success Response:
{
  "status": "success",
  "message": "User updated successfully"
}

5. POST /user/change-password

Change user password.

Request Body:
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}

Response:
{
  "status": "success",
  "message": "Password updated successfully"
}


---

🏦 Account APIs

Authorization Required

6. GET /account

Fetch all accounts of the authenticated user.

Response:
{
  "status": "success",
  "message": "Account fetched successfully",
  "accounts": [
    {
      "id": 3,
      "account_name": "Cash",
      "account_number": "ACC123",
      "account_balance": 5000,
      "createdat": "2024-01-01T10:00:00Z"
    }
  ]
}

7. POST /account

Create a new account.

Request Body:
{
  "name": "Cash",
  "amount": 1000,
  "account_number": "ACC100"
}

Response:
{
  "status": "success",
  "message": "Account created successfully",
  "data": {
    "id": 5,
    "account_name": "Cash",
    "account_balance": 1000
  }
}

8. POST /account/:id/add-money

Add money to an account.

Request Body:
{
  "amount": 300
}

Response:
{
  "status": "success",
  "message": "Money added successfully",
  "data": {
    "id": 5,
    "account_balance": 1300
  }
}

9. POST /account/:id/transfer

Transfer money between accounts.

Request Body:
{
  "amount": 200,
  "toAccount": 6
}

Response:
{
  "status": "success",
  "message": "Money transferred successfully"
}


---

💰 Transaction APIs

Authorization Required

10. GET /transaction

Fetch all transactions.

11. GET /transaction/dashboard

Dashboard metrics & chart data.

Response:
{
  "status": "success",
  "availableBalance": 52000,
  "totalIncome": 30000,
  "totalExpense": 8000,
  "ChartData": [
    {
      "label": "Jan",
      "Income": 5000,
      "Expense": 2000
    }
  ],
  "lastTransactions": [...],
  "lastAccounts": [...]
}


---

🔒 Headers

All protected routes require:

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

❗ Error Response Format
{
  "status": "failed",
  "message": "Error message here"
}

---


📬 Contact

If you have questions regarding the API structure or implementation:

Shaik Kudhan
GitHub: https://github.com/Kudhan

---

PostMan-https://www.postman.com/sample-8789/workspace/resume-builder/collection/37612333-1ddcac83-bc41-4977-96bf-6337795dbf53?action=share&source=copy-link&creator=37612333

