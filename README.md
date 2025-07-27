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

## 8. API Documentation

*Authentication*
- POST /api/endpoints/register.php - User registration
- POST /api/endpoints/login.php - User login
- GET /api/endpoints/profile.php - Get user profile
- POST /api/endpoints/update_profile.php - Update profile
- POST /api/endpoints/change_password.php - Change password

*Medicines*
- GET /api/endpoints/medicines.php - Get medicines list
- POST /api/endpoints/add_medicine_review.php - Add review
- GET /api/endpoints/get_medicine_reviews.php - Get reviews

*AI Chat*
- POST /api/endpoints/send_message.php - Send message
- GET /api/endpoints/get_chat_history.php - Get chat history
- POST /api/endpoints/ai_chat.php - AI chat processing
- GET /api/endpoints/ai_status.php - Check AI status

*Emergency & First Aid*
- GET /api/endpoints/emergency_contacts.php - Get contacts
- POST /api/endpoints/add_emergency_contact.php - Add contact
- GET /api/endpoints/first_aid_practices.php - Get first aid procedures

*Search & History*
- GET /api/endpoints/get_search_history.php - Get search history

*For detailed request/response examples, see [api/README.md](api/README.md).*

---

## 8. API Documentation

*Authentication*
- POST /api/endpoints/register.php - User registration
- POST /api/endpoints/login.php - User login
- GET /api/endpoints/profile.php - Get user profile
- POST /api/endpoints/update_profile.php - Update profile
- POST /api/endpoints/change_password.php - Change password

*Medicines*
- GET /api/endpoints/medicines.php - Get medicines list
- POST /api/endpoints/add_medicine_review.php - Add review
- GET /api/endpoints/get_medicine_reviews.php - Get reviews

*AI Chat*
- POST /api/endpoints/send_message.php - Send message
- GET /api/endpoints/get_chat_history.php - Get chat history
- POST /api/endpoints/ai_chat.php - AI chat processing
- GET /api/endpoints/ai_status.php - Check AI status

*Emergency & First Aid*
- GET /api/endpoints/emergency_contacts.php - Get contacts
- POST /api/endpoints/add_emergency_contact.php - Add contact
- GET /api/endpoints/first_aid_practices.php - Get first aid procedures

*Search & History*
- GET /api/endpoints/get_search_history.php - Get search history

*For detailed request/response examples, see [api/README.md](api/README.md).*

---

## 9. Development & Testing

- See the "Development" and "Testing" sections in your current README for workflow and API testing examples.
- Use Expo Go for mobile app testing.
- Use Postman or curl for API testing.

---

## 10. Deployment

- Build frontend: npm run build in admin-dashboard/client
- Set production environment and start backend: NODE_ENV=production npm start in admin-dashboard/server
- Deploy PHP API to a web server (Apache/Nginx)
- Build mobile app for production with Expo

---

## 11. Default Credentials

*Admin Dashboard*
- Username: admin
- Email: admin@uzimaai.com
- Password: admin123

*Sample User*
- Email: sash@example.com
- Password: user123

---

## 12. Troubleshooting

- Database connection issues: Check MySQL service and credentials
- Mobile app API connection: Update IP, check XAMPP, test endpoints
- Admin dashboard issues: Check Node.js version, clear npm cache, reinstall dependencies
- Expo issues: Clear Expo cache, reset Metro bundler
- Network: Allow necessary ports, ensure devices are on the same network

---

## 13. Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 14. License

This project is licensed under the MIT License.

---

## 15. Support

For issues and questions:
1. Check the troubleshooting section
2. Review the documentation
3. Check existing issues
4. Create a new issue with detailed information

---

*UzimaAI* - Empowering health management through technology

