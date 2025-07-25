# UzimaAI Admin Dashboard

A comprehensive admin dashboard for managing the UzimaAI healthcare mobile application. Built with React.js frontend and Express.js backend with MySQL database.

## 🚀 Features

### Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Role-based access control
- Session management
- Rate limiting protection

### User Management
- View all users with pagination and search
- Create, update, and deactivate users
- User statistics and analytics
- Emergency contact management
- User activity tracking

### Medicine Management
- Complete CRUD operations for medicines
- Medicine status management (active/inactive)
- Medicine reviews and ratings
- Side effects and alternatives tracking
- Medicine statistics

### Review Management
- Moderate medicine reviews
- Approve/reject reviews
- Review analytics and statistics
- Rating distribution analysis

### Analytics & Reporting
- Real-time dashboard statistics
- Search history analysis
- User activity tracking
- System health monitoring
- Performance metrics

### Search & History
- Search history management
- User context tracking
- Activity logs
- Trend analysis

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Tailwind CSS** - Styling
- **Heroicons** - Icons
- **Recharts** - Charts
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd admin-dashboard
```

### 2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Database Setup
1. Create a MySQL database named `uzimaaidb`
2. Import the database schema from `database/uzimaaidb (3).sql`
3. Create an admin user in the database:

```sql
INSERT INTO admin (adminUsername, adminEmail, adminPassword, adminStatus) 
VALUES ('admin', 'admin@uzimaai.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active');
-- Password is 'admin123'
```

### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=uzimaaidb
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### 5. Start the application

#### Development Mode
```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only
npm run client
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the server
npm start
```

## 🔐 Default Login

- **Username**: admin
- **Password**: admin123

## 📁 Project Structure

```
admin-dashboard/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── medicines.js
│   │   ├── reviews.js
│   │   ├── search.js
│   │   ├── history.js
│   │   └── dashboard.js
│   └── index.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── database/
│   └── uzimaaidb (3).sql
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/profile` - Get admin profile
- `PUT /api/auth/profile` - Update admin profile
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - User statistics

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/stats/overview` - Medicine statistics

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `PUT /api/reviews/:id/status` - Update review status
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/stats/overview` - Review statistics

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/recent-activity` - Recent activity
- `GET /api/dashboard/health` - System health
- `GET /api/dashboard/analytics` - Analytics data
- `GET /api/dashboard/performance` - Performance metrics

## 🎨 Features Overview

### Dashboard
- Real-time statistics
- Recent activity feed
- System health monitoring
- Quick action buttons

### User Management
- User listing with search and filters
- User creation and editing
- User activity tracking
- Emergency contact management

### Medicine Management
- Medicine catalog management
- Medicine status control
- Review integration
- Statistics and analytics

### Review Moderation
- Review approval/rejection
- Rating analysis
- Review statistics
- Quality control

### Analytics
- Search trend analysis
- User activity patterns
- System performance metrics
- Data visualization

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Security headers with helmet
- SQL injection prevention

## 🚀 Deployment

### Backend Deployment
1. Set up a production server
2. Install Node.js and MySQL
3. Configure environment variables
4. Run database migrations
5. Start the server with PM2 or similar

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve the build folder with a web server
3. Configure reverse proxy to backend API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

---

**UzimaAI Admin Dashboard** - Healthcare Management System 