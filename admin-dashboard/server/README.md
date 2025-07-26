# UzimaAI Admin Backend API

A complete Node.js/Express backend API for the UzimaAI Admin Dashboard with MySQL database, JWT authentication, and comprehensive CRUD operations.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **User Management**: Complete CRUD operations for user accounts
- **Medicine Management**: Full medicine database management
- **Review Management**: Handle medicine reviews and ratings
- **Search History**: Track and manage user search activities
- **Security**: Rate limiting, CORS, Helmet security headers
- **Database**: MySQL with connection pooling
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository and navigate to the server directory:**
   ```bash
   cd admin-dashboard/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your database credentials:
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=uzimaaidb
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Initialize the database:**
   ```bash
   npm run init-db
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔐 Default Admin Credentials

After running the initialization script, you can log in with:

- **Username:** `admin`
- **Email:** `admin@uzimaai.com`
- **Password:** `admin123`

⚠️ **Important:** Change the default password after your first login!

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/admin/login` | Admin login | Public |
| GET | `/api/admin/profile` | Get admin profile | Private |
| PUT | `/api/admin/profile` | Update admin profile | Private |
| PUT | `/api/admin/change-password` | Change admin password | Private |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/users` | Get all users | Private |
| GET | `/api/admin/users/count` | Get users count | Private |
| GET | `/api/admin/users/:id` | Get user by ID | Private |
| POST | `/api/admin/users` | Create new user | Private |
| PUT | `/api/admin/users/:id` | Update user | Private |
| DELETE | `/api/admin/users/:id` | Delete user | Private |

### Medicine Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/medicines` | Get all medicines | Private |
| GET | `/api/admin/medicines/count` | Get medicines count | Private |
| GET | `/api/admin/medicines/:id` | Get medicine by ID | Private |
| POST | `/api/admin/medicines` | Create new medicine | Private |
| PUT | `/api/admin/medicines/:id` | Update medicine | Private |
| DELETE | `/api/admin/medicines/:id` | Delete medicine | Private |

### Review Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/reviews` | Get all reviews | Private |
| GET | `/api/admin/reviews/count` | Get reviews count | Private |
| GET | `/api/admin/reviews/:id` | Get review by ID | Private |
| PUT | `/api/admin/reviews/:id/status` | Update review status | Private |
| DELETE | `/api/admin/reviews/:id` | Delete review | Private |

### Search History

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/search-history` | Get all search history | Private |
| GET | `/api/admin/search-history/count` | Get search history count | Private |
| GET | `/api/admin/search-history/:id` | Get search by ID | Private |
| DELETE | `/api/admin/search-history/:id` | Delete search record | Private |

## 🔧 Request/Response Examples

### Login
```bash
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "adminId": 1,
    "adminUsername": "admin",
    "adminEmail": "admin@uzimaai.com",
    "adminPhone": "+1234567890",
    "adminStatus": "active"
  }
}
```

### Create User
```bash
POST /api/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "john_doe",
  "useremail": "john@example.com",
  "phone": "+1234567890",
  "emergencyphone": "+0987654321",
  "userpassword": "securepassword123",
  "userstatus": "active"
}
```

### Create Medicine
```bash
POST /api/admin/medicines
Authorization: Bearer <token>
Content-Type: application/json

{
  "medicineName": "Paracetamol",
  "medicineUses": "Pain relief and fever reduction",
  "medicineSideEffects": "May cause stomach upset, allergic reactions",
  "medicineAlternatives": "Ibuprofen, Aspirin",
  "medicineStatus": 1
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with 12 salt rounds
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Various HTTP headers for security
- **Input Validation**: Request validation and sanitization
- **SQL Injection Protection**: Parameterized queries

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── adminController.js    # Admin authentication & profile
│   ├── userController.js     # User CRUD operations
│   ├── medicineController.js # Medicine CRUD operations
│   ├── reviewController.js   # Review management
│   └── searchController.js   # Search history management
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── adminRoute.js        # Admin routes
│   ├── userRoute.js         # User routes
│   ├── medicineRoute.js     # Medicine routes
│   ├── reviewRoute.js       # Review routes
│   └── searchRoute.js       # Search history routes
├── scripts/
│   └── init-db.js           # Database initialization
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md               # This file
```

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

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **JWT Token Issues:**
   - Check JWT_SECRET is set
   - Verify token expiration time
   - Ensure Authorization header format: `Bearer <token>`

3. **CORS Errors:**
   - Update CORS_ORIGIN in `.env`
   - Check frontend URL matches CORS configuration

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team. 