# EduLearn India 🇮🇳

A free educational platform for Indian students to learn programming, mathematics, English, and more.

## 🚀 Features

- **Multiple Subjects**: Programming (JavaScript, Python), Mathematics, English Grammar, and more
- **Interactive Learning**: Code examples with syntax highlighting
- **Progress Tracking**: Monitor your learning journey
- **User Authentication**: Secure login and registration
- **Dark/Light Theme**: Toggle between themes for comfortable learning
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Syntax Highlighter** - Code syntax highlighting

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or MongoDB Atlas account)
- **npm** or **yarn**

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd edulearn-india
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Setup environment variables
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/edulearn
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### 5. Seed the database (optional)
```bash
node scripts/seedData.js
```

## 🚀 Running the Application

### Development Mode (Both servers)
```bash
npm run dev
```

### Backend only
```bash
npm run server
```

### Frontend only
```bash
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
edulearn-india/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # Context API (Auth, Theme)
│       ├── pages/          # Page components
│       └── App.js
├── middleware/             # Express middleware
├── models/                 # MongoDB models
├── routes/                 # API routes
├── scripts/                # Utility scripts
├── server.js              # Express server
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:slug` - Get subject by slug

### Topics
- `GET /api/topics/subject/:subjectId` - Get topics by subject
- `GET /api/topics/:slug` - Get topic by slug

### Content
- `GET /api/content/topic/:topicId` - Get content by topic

### Progress
- `POST /api/progress` - Update user progress (protected)
- `GET /api/progress` - Get user progress (protected)

## 🎨 Features in Detail

### User Authentication
- Secure registration and login
- JWT-based authentication
- Password hashing with bcrypt

### Learning Content
- Structured subjects and topics
- Code examples with syntax highlighting
- Difficulty levels (easy, medium, hard)
- Estimated completion time

### Progress Tracking
- Track completed topics
- View learning statistics
- Monitor last accessed topics

### Theme Support
- Light and dark mode
- Persistent theme preference
- Smooth transitions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for Indian students

## 🙏 Acknowledgments

- React community
- MongoDB documentation
- Express.js team
- All open-source contributors

---

**Happy Learning! 📚**
