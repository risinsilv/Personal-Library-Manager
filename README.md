# Personal Library Manager

A full-stack MERN application that allows users to search for books using the Google Books API and manage their personal library.

## 🚀 Features

- **Search Books**: Search for books by title, author, or keyword using Google Books API
- **User Authentication**: Secure signup/login with JWT authentication
- **Personal Library**: CRUD operations for managing saved books
- **Book Status**: Track reading status (Want to Read, Reading, Completed)
- **Personal Reviews**: Add reviews and notes to saved books
- **Protected Routes**: Secure routes with JWT token validation
- **Axios Interceptors**: Automatic token attachment and error handling

## 🛠️ Tech Stack

### Frontend
- React.js (Hooks)
- Material-UI (MUI)
- Axios with Interceptors
- React Router
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "The Personal Library Manger Ceylon X"
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Install frontend dependencies
```bash
cd ../client
npm install react-router-dom
```

### 4. Environment Variables

Create a `.env` file in the **root directory** (not in client or server folders):

```env
# Backend API
VITE_API_URL=http://localhost:5000/api

# Google Books API (Optional)
VITE_GOOGLE_BOOKS_API_KEY=

# MongoDB
MONGO_URI=mongodb://localhost:27017/personal-library

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

NODE_ENV=development
```

**Important**: 
- Frontend variables must be prefixed with `VITE_`
- Get a Google Books API key from [Google Cloud Console](https://console.developers.google.com/) (optional but recommended)

## 🚀 Running the Application

### Start MongoDB
Make sure MongoDB is running on your machine or use MongoDB Atlas.

### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

### Start Frontend
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
root/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/            # Axios instance & API services
│   │   │   ├── axios.js    # Axios with interceptors
│   │   │   ├── authService.js
│   │   │   ├── booksService.js
│   │   │   ├── googleBooksService.js
│   │   │   └── index.js
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── BookCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/        # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Library.jsx
│   │   └── app/
│   │       └── App.jsx     # Main app with routing
│   └── package.json
│
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   └── Book.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   └── books.js
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   └── bookController.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   ├── index.js          # Server entry point
│   └── package.json
│
├── .env                   # Environment variables (create this)
├── .env.example          # Environment template
└── README.md
```

## 🔐 Authentication Flow

1. User signs up with username, email, and password
2. Password is hashed using bcryptjs
3. JWT token is generated and sent to client
4. Token is stored in localStorage
5. Axios interceptors automatically attach token to API requests
6. Protected routes verify token before allowing access
7. On 401 error, user is automatically logged out

## 📡 API Endpoints

### Auth Routes
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Book Routes (Protected)
- `GET /api/books` - Get all user's books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Save book to library
- `PUT /api/books/:id` - Update book (status, review)
- `DELETE /api/books/:id` - Delete book

## 🎨 Design Decisions

### Axios Interceptors
- **Request Interceptor**: Automatically attaches JWT token from localStorage to every API call
- **Response Interceptor**: Handles global errors (401, 403, 404, 500) and network errors

### Architecture
- **Separation of Concerns**: Clear separation between API logic, components, and pages
- **Context API**: Simple state management for authentication
- **Protected Routes**: HOC pattern for route protection
- **Material-UI**: Modern, consistent UI with minimal custom CSS

### Security
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with 7-day expiration
- Protected API routes with middleware
- Token validation on every protected request

## 🌟 Usage

1. **Sign Up/Login**: Create an account or login
2. **Search Books**: Use the search bar to find books
3. **Save Books**: Click "Save to Library" on any book
4. **Manage Library**: View, edit status, add reviews, or delete books
5. **Track Progress**: Use status to track reading progress

## 📦 Packages to Install

If you haven't installed react-router-dom yet:

```bash
cd client
npm install react-router-dom
```

Backend packages (already in package.json):
```bash
cd server
npm install
```

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Make sure MongoDB is running or check your MONGO_URI
- **CORS Error**: Ensure backend server is running on port 5000
- **Token Issues**: Clear localStorage and login again
- **Environment Variables**: Make sure .env file is in the root directory

## 📝 License

MIT

## 👤 Author

Your Name
