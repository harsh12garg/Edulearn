import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import Tutorial from './pages/Tutorial';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminManagement from './pages/AdminManagement';
import Notes from './pages/Notes';
import AdminNotes from './pages/AdminNotes';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/learn/:slug" element={<Tutorial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage" element={<AdminManagement />} />
          <Route path="/admin/notes" element={<AdminNotes />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <AppContent />
          </Router>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
