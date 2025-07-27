# UzimaAI

Empowering health management through technology.

## our demo video link  to show the overview of how our app is its feature and  interface 
 https://youtu.be/4HhHlZLZ_GE
---

## Table of Contents

1. Project Overview
2. Features
3. System Architecture
4. Technologies Used
5. Quick Start
6. Detailed Setup Instructions
7. Configuration
8. API Documentation
9. Development & Testing
10. Deployment
11. Default Credentials
12. Troubleshooting
13. Contributing
14. License
15. Support

## 1. Project Overview

UzimaAI is a health-focused platform providing users with AI-powered medical information, medicine management, emergency contacts, and an admin dashboard for system management. The project aims to make health information and emergency support more accessible and manageable for both users and administrators.

## 2. Features

Admin Dashboard
- User management (CRUD)
- Medicine management (CRUD)
- Review moderation
- Search history analytics
- Dashboard with charts/statistics
- Secure admin authentication

Mobile App
- User registration/login/profile
- Medicine search and reviews
- AI health chatbot
- Emergency contact management
- First aid information
- Search history

---

PHP API
- RESTful endpoints for all features
- JWT-based authentication
- Input validation and error handling
- CORS support

---

## 3. System Architecture

- Mobile App: React Native (Expo)
- API: PHP REST API
- Admin Dashboard: React frontend + Node.js/Express backend
- Database: MySQL/SQL

---

## 4. Technologies Used

- React, Vite, Tailwind CSS (Admin Dashboard)
- Node.js, Express, MySQL2, JWT (Admin Backend)
- PHP, MySQLi/PDO (API)
- React Native, Expo, Axios (Mobile App)
- ESLint, PostCSS, Docker (optional for deployment)

---

## 5. Quick Start

### Clone the Repository

bash
git clone https://github.com/goldensash1/uzimaai.git
cd uzimaai 

### Set Up XAMPP

1. Download and install [XAMPP](https://www.apachefriends.org/)
2. Start Apache and MySQL services
3. Place the project in the htdocs folder

### Database Setup

bash
mysql -u root -p < database/uzimaaidb\ \(4\).sql


### Start All Services

*Admin Dashboard Backend*
```bash
cd admin-dashboard/server
npm install
npm run dev
```

*Admin Dashboard Frontend*
```bash
cd admin-dashboard/client
npm install
npm run dev
```

*Mobile App*
```bash
cd uzimaai-app
npm install
npx expo start
```

---

## 6. Detailed Setup Instructions

### Environment Setup

- Install XAMPP and start Apache/MySQL
- Install Node.js dependencies for all subprojects

### Database Configuration

- Create the database and import schema/data
- Configure database connections in api/config/db.php and admin-dashboard/server/config/db.js

### API Configuration

- Update the mobile app API URL in uzimaai-app/constants/api.ts or use node update-ip.js

### Start Services

- Start backend, frontend, and mobile app as described above

---

## 7. Configuration

### Environment Variables

**Admin Dashboard Backend (.env):**
```bash
NODE_ENV=development
PORT=8000
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=uzimaaidb
DB_PORT=3306
CORS_ORIGIN=http://localhost:5173
```
*Mobile App API Configuration:*
```bash
Update uzimaai-app/constants/api.ts with your local IP address.
```
---

