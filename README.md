
## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone [<repository-url](https://github.com/goldensash1/uzimaai.git)
cd uzimaai
```

### 2. Set Up XAMPP
1. Download and install [XAMPP](https://www.apachefriends.org/)
2. Start Apache and MySQL services
3. Place the project in `htdocs` folder

### 3. Database Setup
```bash
# Import the database
mysql -u root -p < database/uzimaaidb\ \(4\).sql
```

### 4. Start All Services

#### Admin Dashboard
```bash
# Backend
cd admin-dashboard/server
npm install
npm run dev

# Frontend (new terminal)
cd admin-dashboard/client
npm install
npm run dev
```

#### Mobile App
```bash
cd uzimaai-app
npm install
npx expo start
```

## 📖 Detailed Setup Instructions

### Step 1: Environment Setup

#### Install XAMPP
1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Install and start Apache and MySQL
3. Verify services are running at `http://localhost`

#### Install Node.js Dependencies
```bash
# Admin Dashboard Backend
cd admin-dashboard/server
npm install

# Admin Dashboard Frontend
cd admin-dashboard/client
npm install

# Mobile App
cd uzimaai-app
npm install
```

### Step 2: Database Configuration

#### Create Database
```bash
# Access MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS uzimaaidb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# Import schema and data
mysql -u root -p uzimaaidb < database/uzimaaidb\ \(4\).sql
```

#### Configure Database Connections

**PHP API** (`api/config/db.php`):
```php
$host = 'localhost';
$db   = 'uzimaaidb';
$user = 'root';
$pass = '';
```

**Admin Dashboard** (`admin-dashboard/server/config/db.js`):
```javascript
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'uzimaaidb',
  port: process.env.DB_PORT || 3306
};
```

### Step 3: API Configuration

#### Update Mobile App API URL
```bash
cd uzimaai-app
node update-ip.js
```

Or manually update `uzimaai-app/constants/api.ts`:
```typescript
export const API_BASE_URL = 'http://YOUR_IP_ADDRESS/uzimaai/api/endpoints';
```

### Step 4: Start Services

#### Admin Dashboard
```bash
# Terminal 1: Backend
cd admin-dashboard/server
npm run dev
# Runs on http://localhost:8000

# Terminal 2: Frontend
cd admin-dashboard/client
npm run dev
# Runs on http://localhost:5173
```

#### Mobile App
```bash
cd uzimaai-app
npx expo start
# Opens Expo DevTools in browser
```

## ⚙️ Configuration

### Environment Variables

#### Admin Dashboard Backend (`.env`)
```env
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

#### Mobile App API Configuration
Update `uzimaai-app/constants/api.ts` with your local IP address:
```typescript
export const API_BASE_URL = 'http://192.168.1.100/uzimaai/api/endpoints';
```

### IP Address Management

The mobile app needs to connect to your local server. Use the provided script:
```bash
cd uzimaai-app
node update-ip.js
```

This automatically detects and updates your IP address in the API configuration.

## 🎨 Features

### Admin Dashboard
- **User Management**: View, add, edit, and delete users
- **Medicine Management**: Manage medicine database with details
- **Review Management**: Moderate user reviews and ratings
- **Search History**: Track user search queries
- **Analytics**: Dashboard with charts and statistics
- **Authentication**: Secure admin login with JWT

### Mobile App
- **User Authentication**: Register, login, profile management
- **Medicine Search**: Search and view medicine information
- **Reviews & Ratings**: Rate and review medicines
- **AI Chatbot**: Health-related AI assistance
- **Emergency Contacts**: Manage emergency contact list
- **First Aid**: Comprehensive first aid procedures database
- **Search History**: Track user search activity

### PHP API
- **RESTful Endpoints**: Complete CRUD operations
- **Authentication**: JWT-based user authentication
- **Data Validation**: Input sanitization and validation
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Cross-origin resource sharing

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/endpoints/register.php` - User registration
- `POST /api/endpoints/login.php` - User login
- `GET /api/endpoints/profile.php` - Get user profile
- `POST /api/endpoints/update_profile.php` - Update profile
- `POST /api/endpoints/change_password.php` - Change password

### Medicine Endpoints
- `GET /api/endpoints/medicines.php` - Get medicines list
- `POST /api/endpoints/add_medicine_review.php` - Add review
- `GET /api/endpoints/get_medicine_reviews.php` - Get reviews

### AI Chat Endpoints
- `POST /api/endpoints/send_message.php` - Send message
- `GET /api/endpoints/get_chat_history.php` - Get chat history
- `POST /api/endpoints/ai_chat.php` - AI chat processing
- `GET /api/endpoints/ai_status.php` - Check AI status

### Emergency & First Aid
- `GET /api/endpoints/emergency_contacts.php` - Get contacts
- `POST /api/endpoints/add_emergency_contact.php` - Add contact
- `GET /api/endpoints/first_aid_practices.php` - Get first aid procedures

### Search & History
- `GET /api/endpoints/get_search_history.php` - Get search history

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check MySQL service
sudo service mysql status

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check credentials in config files
```

#### 2. Mobile App Can't Connect to API
```bash
# Update IP address
cd uzimaai-app
node update-ip.js

# Check XAMPP is running
# Verify Apache and MySQL services

# Test API endpoint
curl http://YOUR_IP/uzimaai/api/endpoints/login.php
```

#### 3. Admin Dashboard Won't Start
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. Expo Development Issues
```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache
```

### Network Configuration

#### Firewall Settings
- Allow port 80 (Apache)
- Allow port 3306 (MySQL)
- Allow port 8000 (Admin Backend)
- Allow port 5173 (Admin Frontend)

#### Router Configuration
- Ensure devices are on same network
- Check router firewall settings
- Verify port forwarding if needed

## 🛠️ Development

### Code Structure

#### Admin Dashboard
- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Node.js with Express, MySQL
- **Authentication**: JWT tokens
- **State Management**: React Context

#### Mobile App
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: StyleSheet with consistent design
- **API Integration**: Custom fetch wrapper

#### PHP API
- **Architecture**: RESTful API
- **Database**: MySQL with prepared statements
- **Security**: Input validation, CORS headers
- **Error Handling**: Standardized error responses

### Development Workflow

1. **Database Changes**: Update schema in `database/` folder
2. **API Development**: Add endpoints in `api/endpoints/`
3. **Frontend Updates**: Modify React components
4. **Mobile Features**: Update Expo app screens
5. **Testing**: Test all components together

### Testing

#### API Testing
```bash
# Test PHP endpoints
curl -X POST http://localhost/uzimaai/api/endpoints/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test Node.js endpoints
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Mobile App Testing
- Use Expo Go app on physical device
- Test on both iOS and Android
- Verify network connectivity
- Test all user flows

## 🚀 Deployment

### Production Setup

#### Admin Dashboard
```bash
# Build frontend
cd admin-dashboard/client
npm run build

# Set production environment
cd admin-dashboard/server
NODE_ENV=production npm start
```

#### PHP API
- Deploy to web server (Apache/Nginx)
- Configure SSL certificates
- Set up proper database credentials
- Enable error logging

#### Mobile App
```bash
# Build for production
cd uzimaai-app
npx expo build:android
npx expo build:ios
```

### Environment Variables (Production)
```env
NODE_ENV=production
JWT_SECRET=your-very-secure-production-secret
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
CORS_ORIGIN=https://yourdomain.com
```

### Security Considerations
- Use strong JWT secrets
- Enable HTTPS
- Implement rate limiting
- Regular security updates
- Database backup strategy
- Input validation and sanitization

## 📝 Default Credentials

### Admin Dashboard
- **Username**: `admin`
- **Email**: `admin@uzimaai.com`
- **Password**: `admin123`

### Sample User
- **Email**: `john@example.com`
- **Password**: `user123`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the documentation
3. Check existing issues
4. Create a new issue with detailed information

---

**UzimaAI** - Empowering health management through technology
