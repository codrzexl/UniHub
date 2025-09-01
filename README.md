# UniHub - College Resource Sharing Platform

UniHub is a comprehensive web-based platform designed for college students and faculty to share resources, ask questions, and stay updated with college events in a closed academic ecosystem.

## Features

### 🔐 User Authentication
- Role-based signup and login (Student/Faculty)
- JWT-secured routes with bcrypt password hashing
- Persistent login sessions

### 📚 Notes Sharing Module
- Upload PDF, DOC, DOCX, TXT, PPT, PPTX files
- Metadata support (title, subject, semester, tags)
- Advanced filtering by semester, subject, and search
- Download tracking and like system
- File size limit: 10MB

### ❓ Doubt Forum
- Post academic questions with rich text content
- Threaded comment system for answers
- Upvote/downvote system for questions and answers
- Mark questions as solved
- Filter by subject, semester, and solved status

### 📅 Event Board
- Faculty can create college event announcements
- RSVP system with Going/Maybe/Can't Go options
- Event details with date, time, location
- Attendance tracking and statistics

### 🔍 Global Search
- Search across notes, questions, and events
- Auto-suggestions based on subjects and tags
- Filter results by content type

### 📊 Dashboard
- Personal activity statistics
- Platform overview metrics
- Recent activity feed
- Quick action shortcuts

## Technology Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas (recommended)

## Project Structure

\`\`\`
unihub/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Layout/     # Layout components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   │   ├── Auth/       # Authentication pages
│   │   │   ├── Notes/      # Notes-related pages
│   │   │   ├── Doubts/     # Doubt forum pages
│   │   │   └── Events/     # Event pages
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── uploads/           # File storage
│   ├── server.js          # Entry point
│   └── package.json
└── README.md
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/unihub
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
NODE_ENV=development
\`\`\`

4. Start the server:
\`\`\`bash
npm run dev
\`\`\`

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
\`\`\`bash
cd client
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes/upload` - Upload a note
- `GET /api/notes/:id` - Get specific note
- `GET /api/notes/:id/download` - Download note file
- `POST /api/notes/:id/like` - Like/unlike note
- `DELETE /api/notes/:id` - Delete note (owner only)

### Doubts
- `GET /api/doubts` - Get all doubts (with filters)
- `POST /api/doubts` - Post a doubt
- `GET /api/doubts/:id` - Get specific doubt
- `POST /api/doubts/:id/answer` - Answer a doubt
- `POST /api/doubts/:id/vote` - Vote on doubt
- `PATCH /api/doubts/:id/solve` - Mark as solved
- `POST /api/doubts/:doubtId/answer/:answerId/vote` - Vote on answer

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Faculty only)
- `GET /api/events/:id` - Get specific event
- `POST /api/events/:id/rsvp` - RSVP to event
- `PUT /api/events/:id` - Update event (creator only)
- `DELETE /api/events/:id` - Delete event (creator only)

### Search
- `GET /api/search` - Global search
- `GET /api/search/suggestions` - Search suggestions

## User Roles & Permissions

### Students
- Upload and download notes
- Ask and answer questions
- RSVP to events
- Search and browse content

### Faculty
- All student permissions
- Create and manage events
- Enhanced question answering capabilities

## File Upload Guidelines

### Supported Formats
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Plain Text (.txt)
- PowerPoint (.ppt, .pptx)

### Restrictions
- Maximum file size: 10MB
- Files are stored locally in `/uploads` directory
- File names are automatically generated to prevent conflicts

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File type validation
- Role-based access control
- CORS protection

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `build`
5. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the repository or contact the development team.

---

**UniHub** - Connecting students and faculty through knowledge sharing! 🎓
