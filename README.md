# Inventory Management System

A full-stack MERN application for managing inventory with user authentication and shop-specific inventory management.

## Features

- User authentication (Register/Login)
- JWT-based authentication with refresh tokens
- Shop-specific inventory management
- CRUD operations for inventory items
- Search and filter functionality
- Low stock alerts
- Responsive UI

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React.js
- React Router
- Context API for state management
- Tailwind CSS for styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventory-management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Inventory
- GET `/api/inventory` - Get all inventory items
- GET `/api/inventory/:id` - Get a single inventory item
- POST `/api/inventory` - Create a new inventory item
- PUT `/api/inventory/:id` - Update an inventory item
- DELETE `/api/inventory/:id` - Delete an inventory item
- GET `/api/inventory/search` - Search inventory items
- GET `/api/inventory/low-stock` - Get low stock items

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookies for token storage
- CORS protection
- Input validation
- User data isolation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 