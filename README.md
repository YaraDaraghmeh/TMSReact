<div align="center">

#  Task Management System


[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*Enhance productivity and collaboration with our intuitive task management platform* 

</div>

---

## 🌟 Key Features

### 👨‍🎓 For Students
- **Task Dashboard**: View and manage your assigned tasks
- **Status Tracking**: Monitor the progress of your tasks (Pending, In Progress, etc.)
- **Project**: Display all projects for each student
- **Communication**: Chat with administrators for support and collaboration

### 👨‍💼 For Administrators
- **User Management**: Oversee student accounts and information
- **Task Assignment**: Create and assign tasks to specific students
- **Progress Monitoring**: Track task completion status
- **Direct Communication**: Chat with students to provide guidance

### 🌐 General Features
- **User Authentication**: Secure sign-up and sign-in functionality
- **Responsive Design**: User-friendly interface adaptable to various devices
- **Dark Theme**: Modern look with improved usability in low-light environments
- **Single Page Application**: Seamless navigation without page reloads
- **Date and Time Display**: Enhanced awareness of deadlines and schedules

## 🚀 Quick Start

### Prerequisites

```bash
node >= 14.0.0
npm >= 6.0.0
```

### Installation

1️⃣ Clone the repository
```bash
git clone [https://github.com/yourusername/task-management-system.git](https://github.com/YaraDaraghmeh/TMSReact.git)
cd task-management-system
```

2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Start development server
```bash
npm run dev
```

## 🛠️ Built With

### Phase 1: Front-End with Fake Data
- 📄 HTML
- 🎨 CSS (LESS)
- 📜 JavaScript
- 💾 Local Storage for data persistence

### Phase 2: React Implementation
- ⚛️ React
- 🎨 Tailwind CSS
- 🔄 State Management
- 🧩 Reusable Components

### Phase 3: Backend Integration
- 🟢 Node.js
- 📊 MySQL/MongoDB Database
- 📡 GraphQL API
- 🔒 Authentication & Authorization

## 📁 Project Structure

```
TMSReact/
├── public/                      # Public assets (favicon, index.html, etc.)
├── server/                     # Backend (Node.js + Express)
│   ├── config/                 # Configuration files (e.g., DB connection)
│   ├── controllers/            # Logic for handling requests (e.g., taskController.js)
│   ├── models/                 # Database models (e.g., Task.js)
│   ├── routes/                 # Express routes (e.g., taskRoutes.js)
│   ├── middleware/             # Middleware functions (e.g., auth)
│   ├── .env                    # Environment variables
│   ├── server.js               # Entry point for the backend server
│   └── package.json            # Backend dependencies
├── src/                        # Frontend React code
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Main application pages (e.g., Dashboard, Login)
│   ├── services/               # Data-fetching or API service functions
│   ├── App.jsx                 # Root React component
│   └── main.jsx                # React entry point
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── eslint.config.js            # Linting configuration
├── index.html                  # Main HTML file
├── package-lock.json           # Lock file for dependencies
├── package.json                # Frontend dependencies
├── postcss.config.cjs          # PostCSS configuration
├── tailwind.config.cjs         # Tailwind CSS config
└── vite.config.js              # Vite build configuration


```

## 📊 Core Features

### Task Management System
- **Task Creation**: Easy task creation with title, description, and deadline
- **Assignment**: Assign tasks to specific students
- **Status Tracking**: Monitor task progress (Pending, In Progress, Completed)
- **Filtering**: Sort and filter tasks based on various criteria

### User System
- **Role-Based Access**: Different functionalities for students and administrators
- **Secure Authentication**: Protected routes and user sessions

### Communication Platform
- **Direct Messaging**: Chat between administrators and students
- **Support System**: Get help and clarification on assigned tasks
- **Collaboration**: Facilitate teamwork and project coordination



---

<div align="center">

⭐️ Star this project if you find it useful!

</div>
