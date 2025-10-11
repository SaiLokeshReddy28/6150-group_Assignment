# Finsight - Personal Finance Manager

A smart, AI-powered web application for managing personal finances with budget tracking, document upload, and financial insights.

---

## 👥 Team Members

| Name | Role | Contribution |
|------|------|--------------|
| **Keerthi Chandrakanth** | Person 1 | Landing page, Login/Signup, Form validation |
| **Sai Lokesh Reddy Nandavarapu** | Person 2 | Dashboard, Navigation system |
| **Manasvini Kottapally** | Person 3 | Budget planning, AI insights |
| **Kalyan Venkata Swamy Karnati** | Person 4 | Document upload, Analytics |

**Course:** 6105-Project  
**Date:** October 2025

---

## 📋 Project Overview

**Finsight** helps users manage their finances through:
- Smart budget planning across multiple categories
- Automated document upload and processing
- AI-powered spending insights and recommendations
- Visual analytics with interactive charts

---

## 🚀 Features

### 🏠 Landing Page (Keerthi)
- Hero section with call-to-action
- Features showcase
- User testimonials
- Statistics and trust badges

### 🔐 Authentication (Keerthi)
- Login and Signup forms with tabs
- 8-field comprehensive signup:
  - Title (Mr/Ms/Mrs/Dr/Prof)
  - Name, Email, Phone, Age, Gender
  - Password with strength indicator
  - Confirm password
- Advanced validation (36+ rules)
- Password requirements: uppercase, lowercase, number, special character
- Progressive enabling: fields → checkbox → button

### 👋 Welcome Onboarding (Keerthi)
- 3-step interactive tutorial
- Feature overview
- Choose starting point

### 📊 Dashboard (Lokesh)
- Financial overview with 4 stat cards
- Interactive charts (spending trends, categories)
- Recent transactions table
- Quick action shortcuts
- Search functionality

### 💰 Budget Planning (Manasvini)
- 6 budget categories with progress bars
- AI insights and warnings
- Create/edit/delete budgets
- Filter by category and time period
- Monthly/yearly views

### 📤 Document Upload (Kalyan)
- Drag & drop file upload
- File validation (PDF, PNG, JPG - max 10MB)
- Upload progress tracking
- File management (view/download/delete)
- Filter and search

### 📈 Insights Dashboard (Kalyan)
- Monthly spending charts
- Category breakdown
- AI-powered recommendations
- Monthly breakdown accordion
- Export reports

---

## 🎨 Bootstrap Components Used (21 Components)

1. Navbar - Responsive navigation
2. Cards - Stats, budgets, features
3. Buttons - Primary, outline, groups
4. Forms - Inputs, selects, checkboxes, radio buttons
5. Input Groups - Icons with inputs
6. Tabs - Login/Signup switching
7. Alerts - Validation messages, AI insights
8. Badges - Status indicators
9. Progress Bars - Password strength, budgets, upload
10. Dropdowns - Profile menu, actions
11. Modals - Forgot password, create budget
12. Tables - Transactions, uploads
13. Accordion - Monthly breakdown
14. List Groups - File lists
15. Grid System - Responsive layouts
16. Flex Utilities - Alignment
17. Spacing Utilities - Margins, padding
18. Text Utilities - Colors, weights
19. Validation States - Success/error feedback
20. Spinners - Loading states
21. Button Groups - Filter toggles

**Total: 21+ components** (exceeds 12 requirement) ✅

---

## 📁 Project Structure

```
Finsight/
├── index.html              # Landing page
├── login.html              # Login & Signup
├── welcome.html            # Onboarding
├── dashboard.html          # Main dashboard
├── budget.html             # Budget planning
├── upload.html             # File upload
├── insights.html           # Analytics
│
├── css/
│   ├── auth.css           # Authentication styles
│   ├── welcome.css        # Onboarding styles
│   ├── navigation.css     # Sidebar & header
│   ├── dashboard.css      # Dashboard styles
│   ├── budget.css         # Budget styles
│   ├── upload.css         # Upload styles
│   └── insights.css       # Insights styles
│
└── js/
    ├── auth-validation.js # Form validation
    ├── welcome.js         # Onboarding logic
    ├── navigation.js      # Navigation system
    ├── dashboard.js       # Dashboard + charts
    ├── budget.js          # Budget management
    ├── upload.js          # File upload
    └── insights.js        # Analytics charts
```

---

## 💻 How to Run

### Quick Start (Easiest):
1. Extract the ZIP file
2. Double-click `index.html`
3. Opens in your browser

### Using VS Code (Recommended):
1. Open project folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"
4. Opens at `http://localhost:5500`

### Using Python:
```bash
cd Finsight
python -m http.server 8000
# Open browser to http://localhost:8000
```

---

## 🗺️ User Flow

```
Landing Page (index.html)
    ↓
    [Click "Get Started"]
    ↓
Login/Signup Page (login.html)
    ├─ Login → Dashboard
    └─ Signup → Welcome Tutorial → Dashboard
             ↓
Dashboard with Navigation
    ├─ Budget Planning
    ├─ Upload Documents
    └─ View Insights
```

---

## ✨ Key Validation Features

### Smart Progressive Enabling:
1. User fills all 8 signup fields
2. Terms checkbox becomes enabled ✅
3. User checks terms
4. Submit button becomes enabled ✅

### Validation Rules (36+ total):
- **Name:** 3-50 characters, letters only, no repeated characters
- **Email:** Valid format, max 100 characters
- **Phone:** Exactly 10 digits, no repeated/sequential numbers
- **Age:** 18-120 years
- **Gender:** Required selection
- **Password:** 8-128 characters, uppercase, lowercase, number, special character
- **All fields:** Real-time validation with green ✅ or red ❌

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.0
- Font Awesome 6.4.0
- Chart.js
- Git

---

## 📱 Responsive Design

Works on all devices:
- Desktop (1920px+)
- Laptop (1200px - 1919px)
- Tablet (768px - 1199px)
- Mobile (< 768px)

---

## ✅ Assignment Requirements

- [x] Login and landing pages created
- [x] Form validation implemented (36+ rules)
- [x] 21 Bootstrap components used (exceeds 12)
- [x] Fully responsive design
- [x] Customized templates
- [x] Complete documentation
- [x] Team collaboration via Git
- [x] Individual branches for each member

---

## 🎓 Individual Contributions

### Keerthi Chandrakanth (Person 1)
**Files:** `index.html`, `login.html`, `welcome.html`, `auth.css`, `welcome.css`, `auth-validation.js`, `welcome.js`

**Features:**
- Landing page with hero, features, testimonials
- Login/Signup with 8-field form
- 36+ validation rules
- Progressive enabling (smart checkbox/button)
- Welcome onboarding with 3 steps

### Sai Lokesh Reddy Nandavarapu (Person 2)
**Files:** `dashboard.html`, `navigation.css`, `dashboard.css`, `dashboard.js`

**Features:**
- Main dashboard with 4 stat cards
- Sidebar navigation system
- 2 interactive charts (Chart.js)
- Quick actions and transactions table
- Search functionality

### Manasvini Kottapally (Person 3)
**Files:** `budget.html`, `budget.css`, `budget.js`

**Features:**
- Budget planning with 6 categories
- AI insights (4 types)
- Create/edit/delete budgets
- Filter and view options
- Progress tracking

### Kalyan Venkata Swamy Karnati (Person 4)
**Files:** `upload.html`, `insights.html`, `upload.css`, `insights.css`, `upload.js`, `insights.js`

**Features:**
- Drag & drop file upload
- File validation and management
- 2 interactive charts (Chart.js)
- Monthly breakdown
- Export functionality

---

## 🔒 Security Features

- Comprehensive input validation
- Password strength enforcement
- Auto-truncation (prevents overflow)
- Pattern detection (repeated/sequential characters)
- Common password blocking
- XSS prevention

---

## 📦 Submission Package

**Includes:**
- 7 HTML files
- 8 CSS files
- 7 JavaScript files
- README.md (this file)

**GitHub Repository:** [Insert URL]

---

## 🧪 Testing

### Quick Test Flow:
1. Open `index.html` → Click "Get Started"
2. Fill signup form (all 8 fields)
3. Watch terms checkbox enable when all fields valid ✅
4. Check terms → Submit button enables ✅
5. Submit → Redirects to welcome page
6. Complete 3-step tutorial
7. Explore dashboard, budget, upload, insights

---

## 🐛 Known Limitations

- Frontend only (no backend/database)
- Simulated AI insights
- Demo file upload (not real processing)
- No data persistence

*These are expected for a frontend-focused academic project.*

---

## 🎯 Project Stats

- **Total Pages:** 7
- **Total Files:** 22
- **Lines of Code:** ~8,500+
- **Bootstrap Components:** 21
- **Validation Rules:** 36+
- **Charts:** 4 (Chart.js)

---

## 📞 Contact

**Team Members:**
- Keerthi Chandrakanth
- Sai Lokesh Reddy Nandavarapu
- Manasvini Kottapally
- Kalyan Venkata Swamy Karnati

**Course:** 6105-Project | Fall 2025

---

## 🎉 Conclusion

Finsight is a complete, responsive personal finance application demonstrating:
- Professional web development skills
- Bootstrap framework mastery
- Team collaboration
- Comprehensive validation
- Modern UX patterns

**Ready for submission and presentation!** ✅

---

**Developed by the Finsight Team**  
*October 2025*