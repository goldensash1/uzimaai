# UzimaAI Admin Dashboard

A complete admin dashboard for the UzimaAI application with a React frontend and Node.js/Express backend.

## 📁 Project Structure

```
admin-dashboard/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js Backend
│   ├── config/           # Database configuration
│   ├── controllers/      # API controllers
│   ├── middleware/       # Authentication middleware
│   ├── routes/          # API routes
│   ├── scripts/         # Database initialization
│   └── package.json     # Backend dependencies
├── db.sql               # Complete database setup with sample data
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Database Setup
First, set up the MySQL database:

```bash
# Create and populate the database
mysql -u root -p < db.sql
```

Or if you prefer to do it step by step:
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS uzimaaidb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Import the database structure and data
mysql -u root -p uzimaaidb < db.sql
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```
Backend runs on: http://localhost:8000

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## 🔐 Default Credentials

### Admin Access
- **Username:** `admin`
- **Email:** `admin@uzimaai.com`
- **Password:** `admin123`

### Sample User (for testing)
- **Email:** `john@example.com`
- **Password:** `user123`

## 📊 Database Contents

The `db.sql` file includes:

- **1 Admin User** - Default admin account
- **12 Sample Users** - Various test accounts
- **10 Medicines** - Common medications with detailed information
- **10 Medicine Reviews** - User reviews with ratings
- **10 Search History Records** - User search queries
- **10 User Context Records** - User context information
- **10 User History Records** - User activity logs

## 📚 Features

### Frontend
- ✅ Modern React with Vite
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ JWT authentication
- ✅ Responsive design
- ✅ User management interface
- ✅ Medicine management interface
- ✅ Review management
- ✅ Search history tracking
- ✅ Interactive charts and graphs
- ✅ Quick action buttons

### Backend
- ✅ Express.js REST API
- ✅ MySQL database
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Comprehensive CRUD operations
- ✅ Error handling

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Lucide React (Icons)
- Recharts (Charts)

### Backend
- Node.js
- Express.js
- MySQL2
- JWT
- Bcrypt
- Helmet
- CORS
- Rate Limiting

## 📖 Documentation

- [Frontend Documentation](./client/README.md)
- [Backend Documentation](./server/README.md)

## 🔧 Development

1. **Clone the repository**
2. **Set up the database** using `db.sql`
3. **Configure environment variables** in `server/.env`
4. **Install dependencies** for both frontend and backend
5. **Start both servers** for development

## 🗄️ Database Schema

### Tables
- `admin` - Admin user accounts
- `users` - Regular user accounts
- `medecines` - Medicine information
- `medecineReviews` - User reviews for medicines
- `searchHistory` - User search queries
- `userContext` - User context information
- `userHistory` - User activity logs

### Key Features
- Foreign key relationships
- Proper indexing
- UTF8MB4 character set
- InnoDB engine for transactions

## 🚀 Deployment

### Production Setup

1. **Set environment variables for production:**
   ```env
   NODE_ENV=production
   JWT_SECRET=your-very-secure-production-secret
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Build and start:**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 📝 License

This project is licensed under the MIT License. 