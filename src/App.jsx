import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import EmployeeDashboard from './components/EmployeeDashboard';
import SiteInchargeDashboard from './components/SiteInchargeDashboard';
import HRDashboard from './components/HRDashboard';
import SBUHeadDashboard from './components/SBUHeadDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from './ui/toaster';
import logo from '../LOGO/Rites LOGO.jpeg';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.6
};

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some(u => u.empId === '121212');
    if (!adminExists) {
      const defaultAdmin = {
        empId: '121212',
        name: 'Admin',
        designation: 'Administrator',
        role: 'Admin',
        password: 'admin@123',
        securityQuestion: "What is your mother's maiden name?",
        securityAnswer: 'Smith',
        clBalance: 12,
        coBalance: 0,
      };
      users.push(defaultAdmin);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
      const user = JSON.parse(loggedInUser);
      setCurrentView(user.role.toLowerCase().replace(' ', ''));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentView(user.role.toLowerCase().replace(' ', ''));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login key="login" onLogin={handleLogin} onNavigate={setCurrentView} />;
      case 'forgot':
        return <ForgotPassword key="forgot" onNavigate={setCurrentView} />;
      case 'employee':
        return <EmployeeDashboard key="employee" user={currentUser} onLogout={handleLogout} />;
      case 'siteincharge':
        return <SiteInchargeDashboard key="siteincharge" user={currentUser} onLogout={handleLogout} />;
      case 'hr':
        return <HRDashboard key="hr" user={currentUser} onLogout={handleLogout} />;
      case 'sbuhead':
        return <SBUHeadDashboard key="sbuhead" user={currentUser} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard key="admin" user={currentUser} onLogout={handleLogout} />;
      default:
        return <Login key="default" onLogin={handleLogin} onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Leave Management System - Rites</title>
        <meta name="description" content="Complete leave management system with multi-level approval workflow for efficient leave tracking and management" />
      </Helmet>
      <div className="min-h-screen gradient-bg text-white fade-in">
        <header className="flex items-center justify-between p-4 shadow-lg hover-lift bg-white">
          <div className="flex items-center">
            <img src={logo} alt="Rites Logo" className="h-12 w-auto logo-animated" />
            <h1 className="ml-4 text-xl md:text-2xl font-bold gradient-text">Rites Leave Management</h1>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8 slide-up">
<AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
        <Toaster />
      </div>
    </>
  );
  }
  
  export default App;
