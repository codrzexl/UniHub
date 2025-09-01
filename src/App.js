import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Notes from './pages/Notes/Notes';
import UploadNote from './pages/Notes/UploadNote';
import NoteDetail from './pages/Notes/NoteDetail';
import Doubts from './pages/Doubts/Doubts';
import PostDoubt from './pages/Doubts/PostDoubt';
import DoubtDetail from './pages/Doubts/DoubtDetail';
import Events from './pages/Events/Events';
import CreateEvent from './pages/Events/CreateEvent';
import EventDetail from './pages/Events/EventDetail';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Faculty Only Route Component
const FacultyRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user?.role !== 'Faculty') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              
              {/* Notes Routes */}
              <Route path="/notes" element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              } />
              
              <Route path="/notes/upload" element={
                <ProtectedRoute>
                  <UploadNote />
                </ProtectedRoute>
              } />
              
              <Route path="/notes/:id" element={
                <ProtectedRoute>
                  <NoteDetail />
                </ProtectedRoute>
              } />
              
              {/* Doubts Routes */}
              <Route path="/doubts" element={
                <ProtectedRoute>
                  <Doubts />
                </ProtectedRoute>
              } />
              
              <Route path="/doubts/post" element={
                <ProtectedRoute>
                  <PostDoubt />
                </ProtectedRoute>
              } />
              
              <Route path="/doubts/:id" element={
                <ProtectedRoute>
                  <DoubtDetail />
                </ProtectedRoute>
              } />
              
              {/* Events Routes */}
              <Route path="/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              
              <Route path="/events/create" element={
                <ProtectedRoute>
                  <FacultyRoute>
                    <CreateEvent />
                  </FacultyRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/events/:id" element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
