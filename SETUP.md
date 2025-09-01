# UniHub Project Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Project Structure
This project has a **monorepo structure** with:
- **Root**: Next.js configuration (can be ignored for now)
- **Client**: React frontend application
- **Server**: Express.js backend API

## Step-by-Step Setup

### 1. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `unihub`

#### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Copy the example file
cp env.example .env
```

4. Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/unihub
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unihub
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_123456789
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The client will run on `http://localhost:3000`

## Running the Project

### Development Mode
1. **Terminal 1** (Backend):
```bash
cd server
npm run dev
```

2. **Terminal 2** (Frontend):
```bash
cd client
npm start
```

### Production Mode
1. **Build Frontend**:
```bash
cd client
npm run build
```

2. **Start Backend**:
```bash
cd server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes/upload` - Upload a note
- `GET /api/notes/:id` - Get specific note
- `GET /api/notes/:id/download` - Download note file

### Doubts
- `GET /api/doubts` - Get all doubts
- `POST /api/doubts` - Post a doubt
- `GET /api/doubts/:id` - Get specific doubt

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Faculty only)
- `GET /api/events/:id` - Get specific event

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on the port

3. **Module Not Found Errors**
   - Run `npm install` in both client and server directories
   - Clear node_modules and reinstall

4. **JWT Secret Error**
   - Ensure JWT_SECRET is set in `.env`
   - Use a strong, unique secret key

### File Upload Issues
- Ensure `server/uploads` directory exists
- Check file size limits (10MB max)
- Verify file type restrictions

## Features Available

### For Students
- Upload and download notes
- Ask and answer questions
- RSVP to events
- Search content

### For Faculty
- All student features
- Create and manage events
- Enhanced permissions

## Security Notes
- JWT tokens expire in 7 days
- Passwords are hashed with bcrypt
- File uploads are validated
- CORS is enabled for development

## Next Steps
1. Register a new account
2. Upload some notes
3. Create events (if faculty)
4. Test all features

## Support
If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables
3. Ensure MongoDB is running
4. Check network connectivity
