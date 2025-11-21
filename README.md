# Anvistride - Vision into Stride, One Step at a Time

<div align="center">

![Anvistride Logo](./client/public/Anvistride_logo.png)

**A comprehensive goal-setting and productivity platform built with the MERN stack**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

[Live Demo](#) • [Documentation](#documentation) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [SDG Alignment](#sdg-alignment)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Real-time Features](#real-time-features)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

**Anvistride** (A **N**ew **V**ision **I**n **S**tride) is a comprehensive goal-setting and productivity platform designed to help individuals transform their long-term visions into actionable, achievable steps. The platform empowers users to set clear goals, break them down into manageable tasks, track progress, and celebrate achievements along their journey.

### Problem Statement

Many individuals struggle with:
- **Lack of clarity** in long-term vision and goals
- **Difficulty breaking down** large goals into actionable steps
- **Poor progress tracking** and accountability
- **Limited motivation** and support systems
- **Fragmented tools** that don't work together

### Solution

Anvistride provides a unified platform that:
- ✅ Helps users define and visualize their long-term visions
- ✅ Breaks down visions into goals, goals into tasks
- ✅ Tracks progress with real-time synchronization
- ✅ Provides accountability through community features
- ✅ Celebrates achievements and milestones
- ✅ Offers a complete productivity ecosystem

---

## 🌍 SDG Alignment

This project aligns with the **United Nations Sustainable Development Goals (SDGs)**, specifically:

### 🎓 SDG 4: Quality Education
- **Target 4.4**: By 2030, substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs and entrepreneurship.
- **Contribution**: Anvistride helps individuals develop goal-setting, planning, and productivity skills essential for personal and professional growth.

### 💼 SDG 8: Decent Work and Economic Growth
- **Target 8.3**: Promote development-oriented policies that support productive activities, decent job creation, entrepreneurship, creativity and innovation.
- **Contribution**: By enabling users to set and achieve career goals, start businesses, and develop professional skills, Anvistride supports economic empowerment and job creation.

### 🤝 SDG 17: Partnerships for the Goals
- **Target 17.17**: Encourage and promote effective public, public-private and civil society partnerships.
- **Contribution**: The platform's community features and accountability partnerships foster collaboration and mutual support among users.

---

## ✨ Features

### Core Features

- 🎯 **Vision Management**: Create and manage long-term visions with detailed descriptions
- 📊 **Goal Setting**: Break down visions into specific, measurable goals
- ✅ **Task Management**: Organize goals into actionable tasks with priorities and deadlines
- 💡 **Ideas Capture**: Quickly capture and organize ideas for future implementation
- 📝 **Notes & Journaling**: Take notes and maintain a personal journal
- 🏆 **Achievements**: Track and celebrate milestones and accomplishments
- 📈 **Analytics Dashboard**: Visualize progress with comprehensive analytics
- 🔄 **Recycle Bin**: Restore accidentally deleted items

### Advanced Features

- 🔄 **Real-time Synchronization**: Multi-device sync using Socket.IO
- 💬 **Chat System**: 
  - Group chat for community engagement
  - Private messaging for accountability partners
- 🔔 **Real-time Notifications**: Get instant updates on achievements and milestones
- 📱 **Activity Feed**: Track all activities across the platform
- 🎨 **Dark Mode**: Toggle between light and dark themes
- ⌨️ **Keyboard Shortcuts**: Power-user features for faster navigation
- 🔍 **Global Search**: Command palette (Cmd+K / Ctrl+K) for quick access
- 📱 **Mobile Responsive**: Fully optimized for mobile devices
- 🔐 **Secure Authentication**: JWT-based authentication with password hashing

### User Experience

- 🎨 **Modern UI/UX**: Beautiful, intuitive interface with glassmorphism design
- ⚡ **Fast Performance**: Optimized with code splitting and lazy loading
- 🎭 **Skeleton Loaders**: Enhanced perceived performance
- 🎯 **Onboarding**: Guided tour for new users
- 📊 **Progress Tracking**: Visual progress indicators and statistics
- 🎉 **Daily Inspiration**: Motivational quotes and daily reminders

---

## 🛠 Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - UI component library
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Express Async Handler** - Async error handling

### DevOps & Tools
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 📁 Project Structure

```
MY PLP Project/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── components/   # React components
│   │   │   ├── chat/     # Chat components
│   │   │   └── ui/       # UI components (shadcn/ui)
│   │   ├── context/      # React Context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layout/        # Layout components
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   ├── routes/       # Route configuration
│   │   └── types/        # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Node.js backend application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── socket/       # Socket.IO handlers
│   │   └── server.js    # Entry point
│   └── package.json
│
├── package.json          # Root package.json (workspaces)
├── README.md            # This file
├── SOCKET_IO_IMPLEMENTATION.md
└── NAVIGATION_GUIDE.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anvistride.git
   cd anvistride
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/anvistride
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anvistride
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Client URL (for CORS)
   CLIENT_URL=http://localhost:5173
   ```

   Create a `.env` file in the `client` directory (optional):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB service from Services panel
   ```

5. **Run the application**
   
   From the root directory:
   ```bash
   # Development mode (runs both client and server)
   npm run dev
   
   # Or run separately:
   # Terminal 1 - Server
   cd server
   npm run dev
   
   # Terminal 2 - Client
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

---

## 🔧 Environment Variables

### Server Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `CLIENT_URL` | Frontend URL for CORS | No | http://localhost:5173 |

### Client Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | No | http://localhost:5000/api |

---

## 📖 Usage

### For End Users

1. **Sign Up**: Create a new account at `/register`
2. **Onboarding**: Complete the guided onboarding tour
3. **Create Vision**: Start by defining your long-term vision
4. **Set Goals**: Break down your vision into specific goals
5. **Add Tasks**: Create actionable tasks for each goal
6. **Track Progress**: Monitor your progress on the dashboard
7. **Celebrate**: Mark achievements and milestones

### For Developers

See [NAVIGATION_GUIDE.md](./NAVIGATION_GUIDE.md) for detailed navigation and routing information.

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Chat Endpoints

#### Get Group Chat
```http
GET /api/chat/group
Authorization: Bearer <token>
```

#### Get Private Chat
```http
GET /api/chat/private/:userId
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/chat/:chatId/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello, world!"
}
```

### User Endpoints

#### Search Users
```http
GET /api/users/search?q=john
Authorization: Bearer <token>
```

### Goals Endpoints

#### Get All Goals
```http
GET /api/goals
Authorization: Bearer <token>
```

#### Create Goal
```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn React",
  "description": "Master React development",
  "deadline": "2024-12-31",
  "priority": "high"
}
```

---

## 🔄 Real-time Features

Anvistride uses **Socket.IO** for real-time functionality:

### Features
- ✅ Multi-device synchronization
- ✅ Real-time notifications
- ✅ Live activity feed
- ✅ Chat messaging
- ✅ Typing indicators
- ✅ Online status

See [SOCKET_IO_IMPLEMENTATION.md](./SOCKET_IO_IMPLEMENTATION.md) for detailed documentation.

---

## 🚢 Deployment

### Frontend (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel
   ```

3. **Set Environment Variables**
   - `VITE_API_BASE_URL`: Your backend API URL

### Backend (Render/Railway/Heroku)

#### Using Render

1. **Create a new Web Service**
2. **Connect your repository**
3. **Set build command**: `cd server && npm install`
4. **Set start command**: `cd server && npm start`
5. **Add Environment Variables**:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `NODE_ENV=production`

#### Using Railway

1. **Create a new project**
2. **Add MongoDB service**
3. **Deploy from GitHub**
4. **Set environment variables**

### MongoDB Atlas

1. **Create a cluster** on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Get connection string**
3. **Add to environment variables**

---

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**
   - Register new user
   - Login with credentials
   - Test password reset

2. **CRUD Operations**
   - Create vision/goal/task
   - Update items
   - Delete items
   - Restore from recycle bin

3. **Real-time Features**
   - Open app in multiple tabs
   - Create item in one tab
   - Verify sync in other tabs

4. **Chat Features**
   - Join group chat
   - Send messages
   - Start private chat
   - Test typing indicators

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Follow React and Node.js best practices

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: anvistride@gmail.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- **PLP Academy** - For the opportunity to build this project
- **United Nations** - For the SDG framework
- **Shadcn/ui** - For the beautiful UI components
- **Socket.IO** - For real-time capabilities
- **React Team** - For the amazing framework
- **MongoDB** - For the flexible database
- **All Contributors** - Who have helped improve this project

---

## 📊 Project Statistics

- **Total Commits**: 200+
- **Lines of Code**: 15,000+
- **Components**: 50+
- **API Endpoints**: 20+
- **Real-time Features**: 5+
- **Development Time**: 3+ months

---

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AI-powered goal recommendations
- [ ] Team collaboration features
- [ ] Advanced analytics and insights
- [ ] Integration with calendar apps
- [ ] Export/import functionality
- [ ] Multi-language support
- [ ] Voice commands
- [ ] Browser extension
- [ ] Desktop app (Electron)

---

## 📞 Support

For support, email anvistride@gmail.com or open an issue in the repository.

---

<div align="center">

**Built with ❤️ for PLP Academy Final Project**

**Vision into Stride, One Step at a Time** 🚀

[⬆ Back to Top](#-table-of-contents)

</div>

