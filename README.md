# 🚗 Vehicle Rental System

A robust backend API for managing vehicle rentals with role-based authentication, built with Node.js, TypeScript, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Testing](#testing)
- [License](#license)

## ✨ Features

- **Vehicle Management** - Complete CRUD operations for vehicle inventory with availability tracking
- **User Management** - Customer and admin account management with profile updates
- **Booking System** - Handle vehicle rentals with automatic cost calculation and date validation
- **Authentication & Authorization** - Secure JWT-based authentication with role-based access control
- **Automatic Status Updates** - Smart vehicle availability management based on booking lifecycle
- **Data Validation** - Comprehensive input validation and error handling

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcrypt
- **Type Safety**: TypeScript

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

## 🚀 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd vehicle-rental-system
```

2. **Install dependencies**

```bash
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_rental_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

## 🗄️ Database Setup

1. **Create the database**

```bash
psql -U postgres
CREATE DATABASE vehicle_rental_db;
```

2. **Run migrations**

The application will automatically create the required tables on first run, or you can run:

```bash
npm run migrate
```

### Database Schema

**Users Table**
- `id` - UUID (Primary Key)
- `name` - VARCHAR(255)
- `email` - VARCHAR(255) UNIQUE
- `password` - VARCHAR(255) (hashed)
- `phone` - VARCHAR(20)
- `role` - ENUM('admin', 'customer')

**Vehicles Table**
- `id` - UUID (Primary Key)
- `vehicle_name` - VARCHAR(255)
- `type` - ENUM('car', 'bike', 'van', 'SUV')
- `registration_number` - VARCHAR(50) UNIQUE
- `daily_rent_price` - DECIMAL(10,2)
- `availability_status` - ENUM('available', 'booked')

**Bookings Table**
- `id` - UUID (Primary Key)
- `customer_id` - UUID (Foreign Key → Users)
- `vehicle_id` - UUID (Foreign Key → Vehicles)
- `rent_start_date` - DATE
- `rent_end_date` - DATE
- `total_price` - DECIMAL(10,2)
- `status` - ENUM('active', 'cancelled', 'returned')

## ▶️ Running the Application

**Development mode with hot reload:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 🌐 Live Demo

**Live API**: [https://vehicle-booking-server.vercel.app/](https://vehicle-booking-server.vercel.app/)

## 📚 API Documentation

### Base URL

**Production:**
```
https://vehicle-booking-server.vercel.app/api/v1
```

**Local Development:**
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register New User
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer"
}
```

#### Login
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Vehicle Endpoints

#### Create Vehicle (Admin Only)
```http
POST /vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC123",
  "daily_rent_price": 50.00,
  "availability_status": "available"
}
```

#### Get All Vehicles (Public)
```http
GET /vehicles
```

#### Get Vehicle by ID (Public)
```http
GET /vehicles/:vehicleId
```

#### Update Vehicle (Admin Only)
```http
PUT /vehicles/:vehicleId
Authorization: Bearer <token>
Content-Type: application/json

{
  "daily_rent_price": 55.00,
  "availability_status": "available"
}
```

#### Delete Vehicle (Admin Only)
```http
DELETE /vehicles/:vehicleId
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer <token>
```

#### Update User (Admin or Own Profile)
```http
PUT /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1987654321"
}
```

#### Delete User (Admin Only)
```http
DELETE /users/:userId
Authorization: Bearer <token>
```

### Booking Endpoints

#### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_id": "vehicle-uuid",
  "rent_start_date": "2024-12-10",
  "rent_end_date": "2024-12-15"
}
```

#### Get Bookings (Role-based)
```http
GET /bookings
Authorization: Bearer <token>
```
- **Admin**: Returns all bookings
- **Customer**: Returns only their bookings

#### Update Booking Status
```http
PUT /bookings/:bookingId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled"
}
```
- **Customer**: Can cancel before start date
- **Admin**: Can mark as returned

## 📁 Project Structure

```
vehicle-rental-system/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   └── users.validation.ts
│   │   ├── vehicles/
│   │   │   ├── vehicles.controller.ts
│   │   │   ├── vehicles.service.ts
│   │   │   ├── vehicles.routes.ts
│   │   │   └── vehicles.validation.ts
│   │   └── bookings/
│   │       ├── bookings.controller.ts
│   │       ├── bookings.service.ts
│   │       ├── bookings.routes.ts
│   │       └── bookings.validation.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   └── bcrypt.utils.ts
│   └── app.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access Control

- **Public Routes**: Available to everyone (vehicle listing, signup, signin)
- **Customer Routes**: Requires authentication (create/view own bookings, update own profile)
- **Admin Routes**: Requires admin role (manage vehicles, users, all bookings)

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## 🔒 Security Features

- Password hashing with bcrypt (minimum 6 characters)
- JWT token authentication with expiration
- Role-based authorization
- Input validation and sanitization
- Protection against common vulnerabilities (SQL injection, XSS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

Your Name - [your@email.com](mailto:your@email.com)

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- PostgreSQL community for the robust database
- All contributors who help improve this project

---

**Happy Coding! 🚀**