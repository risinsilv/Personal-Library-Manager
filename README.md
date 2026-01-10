# 📚 Personal Library Manager

A full-stack web application for managing your personal book collection. Search for books using the Google Books API, save them to your library, track reading status, and write personal reviews.

**Live Demo:** [https://personal-library-manager-eosin.vercel.app](https://personal-library-manager-eosin.vercel.app)

## ✨ Features

- 🔐 **User Authentication**: Secure signup and login with JWT-based authentication
- 🔍 **Book Search**: Search for books using the Google Books API
- 📖 **Library Management**: Save, update, and delete books from your personal library
- 📊 **Reading Status**: Track books as "Want to Read", "Reading", or "Completed"
- ✍️ **Personal Reviews**: Add your own reviews and notes for each book
- 📱 **Responsive Design**: Built with Material-UI for a modern, mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and development server
- **Material-UI (MUI)** - Component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Styled Components** - CSS-in-JS styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Jest & Supertest** - Testing framework

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/risinsilv/Personal-Library-Manager.git
cd Personal-Library-Manager
```

### 2. Environment Variables

Create a `.env` file in the **root directory** of the project (same level as `client` and `server` folders) with the following variables:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret (use a strong, random string)
JWT_SECRET=your_jwt_secret_key

# Server Port (optional, defaults to 5000)
PORT=5000
```

#### Environment Variables Explanation:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string. Use MongoDB Atlas or local MongoDB instance | `mongodb://localhost:27017/library-manager` or `mongodb+srv://username:password@cluster.mongodb.net/library-manager` |
| `JWT_SECRET` | Secret key for signing JWT tokens. Should be a long, random string | `your_super_secret_random_string_here_123456` |
| `PORT` | Port number for the backend server (optional) | `5000` |

> **Note:** The `.env` file should be placed in the root directory, not inside `client` or `server` folders. Both the client (via Vite config) and server read from this shared `.env` file.

### 3. Install Dependencies

#### Install Server Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Run the Application

You'll need to run both the backend server and frontend client simultaneously.

#### Terminal 1 - Start the Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

#### Terminal 2 - Start the Frontend Client
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173` (or another port if 5173 is in use)

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🧪 Running Tests

The project includes Jest tests for the backend API.

```bash
cd server
npm test
```

## 📁 Project Structure

```
Personal-Library-Manager/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   └── App.jsx          # Main app component
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
├── server/                   # Backend Node.js application
│   ├── controllers/         # Route controllers
│   │   ├── authController.js    # Authentication logic
│   │   └── bookController.js    # Book CRUD operations
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── User.js          # User schema
│   │   └── Book.js          # Book schema
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   └── books.js         # Book routes
│   ├── tests/               # Jest tests
│   ├── app.js               # Express app configuration
│   ├── index.js             # Server entry point
│   └── package.json         # Backend dependencies
│
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore file
└── README.md                # This file
```

## 🏗️ Architecture & Design Decisions

### Overall Architecture
The application follows a **client-server architecture** with a clear separation between frontend and backend:

- **Frontend (Client)**: A Single Page Application (SPA) built with React and Vite
- **Backend (Server)**: A RESTful API built with Express.js
- **Database**: MongoDB for flexible, document-based data storage

### Backend Architecture

#### 1. **MVC Pattern**
The server follows the **Model-View-Controller (MVC)** pattern:
- **Models** (`models/`): Define data schemas using Mongoose (User, Book)
- **Controllers** (`controllers/`): Handle business logic and request processing
- **Routes** (`routes/`): Define API endpoints and map them to controllers

#### 2. **Middleware-Based Request Flow**
- **CORS Middleware**: Enables cross-origin requests from the frontend
- **JSON Parsing**: Built-in Express middleware for parsing request bodies
- **Authentication Middleware** (`middleware/auth.js`): JWT token verification for protected routes

#### 3. **Authentication Strategy**
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism
- **bcryptjs**: Secure password hashing before storing in database
- **Protected Routes**: All book-related endpoints require valid JWT tokens

#### 4. **Database Design**
- **User Model**: Stores user credentials and profile information
- **Book Model**: Stores book data with references to the owning user
- **Compound Index**: Prevents duplicate books per user using `{ user: 1, googleBooksId: 1 }`

### Frontend Architecture

#### 1. **Component-Based Structure**
- Reusable React components for UI elements
- Material-UI for consistent design language
- Styled Components for custom styling

#### 2. **Client-Side Routing**
- React Router DOM for navigation
- Protected routes requiring authentication

#### 3. **State Management**
- React hooks (useState, useEffect) for local state
- Axios for API communication with the backend

#### 4. **Build Tool**
- **Vite**: Fast development server and optimized production builds
- Custom configuration to read `.env` from parent directory

### Security Considerations

1. **Password Security**: Passwords are hashed using bcryptjs before storage
2. **Token-Based Auth**: JWT tokens expire and must be validated on each request
3. **Authorization**: Users can only access their own books (enforced at the database level)
4. **Environment Variables**: Sensitive data stored in `.env` file (not committed to Git)

### Scalability Considerations

1. **Stateless Backend**: JWT authentication allows horizontal scaling
2. **Database Indexing**: Compound indexes optimize query performance
3. **Separation of Concerns**: Clear separation between frontend and backend allows independent scaling
4. **RESTful API**: Standard API design makes it easy to add new clients (mobile apps, etc.)

### Development Workflow

1. **Nodemon**: Automatic server restart during development
2. **Vite HMR**: Hot Module Replacement for instant frontend updates
3. **Jest Testing**: Automated testing for backend API endpoints
4. **MongoDB Memory Server**: In-memory database for testing without affecting production data

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Books (Protected Routes)
- `GET /api/books` - Get all books for authenticated user
- `GET /api/books/:id` - Get a specific book by ID
- `POST /api/books` - Save a new book to library
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete a book from library

### Health Check
- `GET /api/health` - Check server status

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**risinsilv**
- GitHub: [@risinsilv](https://github.com/risinsilv)

## 🙏 Acknowledgments

- Google Books API for book data
- MongoDB for database services
- Vercel for hosting

---

**Need Help?** If you encounter any issues or have questions, please open an issue on GitHub.