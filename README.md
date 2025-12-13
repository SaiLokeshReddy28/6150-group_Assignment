# Finsight - Personal Finance Manager

A smart, AI-powered **Full-Stack Web Application** for managing personal finances with budget tracking, automated document parsing, and financial insights.

---

## 👥 Team Members

| Name | Role | Contribution |
|------|------|--------------|
| **Keerthi Chandrakanth** | Person 1 | Landing page, Authentication (Login/Signup), UI Design |
| **Sai Lokesh Reddy Nandavarapu** | Person 2 | Document Upload, AI Integration, Insights Dashboard |
| **Manasvini Kottapally** | Person 3 | Admin Panel, Admin Analytics, Admin Creation,  Budget Planning, Budget Analytics |
| **Kalyan Venkata Swamy Karnati** | Person 4 |  Dashboard, Navigation, , Transaction Management|

**Course:** INFO 6150 - Web Design and User Experience Engineering  
**Semester:** Fall 2025  

---

## 📋 Project Overview

**Finsight** helps users manage their finances through:
- **Smart Budget Planning**: Set limits across 6+ categories.
- **Automated Document Intelligence**: Upload PDF bank statements; AI extracts transactions automatically.
- **Financial Insights**: Statistical analysis of spending trends and intelligent recommendations.
- **Role-Based Access**: Specialized features for Admins to manage users and system data.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://react.dev/) (Vite)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) (CDN) & Custom CSS
- **Visualization**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
- **Routing**: `react-router-dom`
- **HTTP Client**: `axios`

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: 
  - **Google OAuth**: Firebase Admin SDK
  - **Local Auth**: JWT (JSON Web Tokens) & Bcrypt (Password Hashing)
- **AI Integration**: [OpenAI API](https://openai.com/) (GPT-4o-mini for PDF Parsing)
- **File Handling**: `multer` (Uploads), `pdf-parse`
- **API Documentation**: [Swagger UI](https://swagger.io/) (`swagger-ui-express`)

---

## 🚀 Features

### 🔐 Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinct `User` and `Admin` roles.
- **Google Sign-In**: Integrated via Firebase for one-click login.
- **Secure Signup**: Comprehensive validation (Age, Gender, Password Strength).
- **Session Management**: JWT-based protected routes.

### 📊 Dashboard
- **Overview Cards**: Income, Expense, Balance, Savings.
- **Recent Transactions**: searchable table with filters.
- **Visual Trends**: Interactive charts for monthly spending.

### 💰 Budget Planning
- **Category Budgets**: Set monthly limits for Food, Transport, Rent, etc.
- **Progress Tracking**: Visual bars showing % of budget used.
- **Alerts**: Warnings when nearing or exceeding budget limits.

### 📤 AI Document Processing (File Upload)
- **Smart Extraction**: Upload PDF blank/credit card statements.
- **AI Parsing**: OpenAI GPT model parses text to extract Date, Amount, Merchant, and Category.
- **Review System**: Transaction preview before saving.

### 📈 Insights & Analytics
- **Spending Trends**: Compare current vs previous month.
- **Category Breakdown**: Where is money going?
- **Recurring Expenses**: Detect subscription-like patterns.
- **AI Insights**: Rule-based and statistical suggestions for financial health.

### 🛡️ Admin Panel
- **User Management**: View and manage registered users.
- **System Monitoring**: View total uploads and activity.

---

## 📚 API Documentation

The backend includes fully interactive API documentation generated with Swagger.

- **Local URL**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)
- **Live URL**: [https://finsight-backend-gwci.onrender.com/api-docs](https://finsight-backend-gwci.onrender.com/api-docs)

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- OpenAI API Key
- Firebase Service Account (for Google Auth)

### 1. Backend Setup
```bash
cd finsight-app/server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in: PORT, MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, FIREBASE_CREDENTIALS

# Start Server
npm run dev
# Server runs on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd finsight-app/client

# Install dependencies
npm install

# Start Development Server
npm run dev
# Client runs on http://localhost:5173
```

---

## ⚠️ Deviations & Clarifications

### 1. Chatbot vs. AI Extraction
**Requirement**: "Integrate an actual chatbot powered by a Large Language Model (LLM)."  
**Implementation**: We utilized the **OpenAI LLM API** to implement **Intelligent Document Extraction** instead of a conversational chatbot. 
- **Reasoning**: For a finance app, we found that automatically converting messy PDF statements into structured transaction data provided higher utility and "wow factor" than a generic Q&A bot. The AI reads the PDF text and structures it into JSON for the database, effectively acting as an "AI Data Entry Assistant".

### 2. UI Library
**Requirement**: "Choose at least ONE UI Library (Bootstrap, Material UI, Tailwind, etc.)"
**Implementation**: We used **Bootstrap 5** (via CDN) combined with custom CSS for a unique, polished look. We did not use comprehensive libraries like Material UI to demonstrate cleaner handling of CSS and Layouts manually where needed.

---

## 🗺️ Application Flow (End-to-End)

1. **User Login**: User signs in via Google or Email/Password.
2. **Dashboard**: user sees empty state or current summary.
3. **Upload**: User uploads a PDF Bank Statement.
4. **Processing**: Backend sends PDF text to OpenAI -> Returns JSON transactions.
5. **Review**: Transactions appear in Dashboard & Insights.
6. **Budgeting**: User sets budget limits based on new insights.
7. **Analysis**: User views "Insights" page for trends and warnings.

---

## 📞 Contact
**Course**: INFO 6150 Fall 2025  
**Team**: Finsight