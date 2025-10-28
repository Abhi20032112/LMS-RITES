import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './components/Landing';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import EmployeeDashboard from './components/EmployeeDashboard';
import SiteInchargeDashboard from './components/SiteInchargeDashboard';
import HRDashboard from './components/HRDashboard';
import SBUHeadDashboard from './components/SBUHeadDashboard';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import { Toaster } from './ui/toaster';
import logo from '../LOGO/WhatsApp Image 2025-09-24 at 11.30.54 AM.jpeg';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

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

    // Check for existing session, but don't auto-login
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      // Only set user if we have a valid session, but keep view as login initially
      setCurrentUser(user);
      // For now, keep on login page - user must login manually
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Route guard: Prevent access to dashboard views without login
  useEffect(() => {
    const dashboardViews = ['employee', 'siteincharge', 'hr', 'sbuhead', 'admin'];
    if (dashboardViews.includes(currentView) && !currentUser) {
      setCurrentView('login');
    }
  }, [currentView, currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Normalize role names to match dashboard component names
    const roleMap = {
      'Employee': 'employee',
      'Site Incharge': 'siteincharge',
      'HR': 'hr',
      'SBU Head': 'sbuhead',
      'Admin': 'admin'
    };

    const normalizedRole = roleMap[user.role] || 'employee';
    setCurrentView(normalizedRole);
    setActiveSection('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Clear any other session data if needed
    localStorage.removeItem('leaveRequests'); // Optional: clear cached requests
    setCurrentView('login');
    // Prevent back button from going back to dashboard
    window.history.replaceState(null, null, window.location.pathname);
  };

  const renderView = () => {
    const dashboardViews = ['employee', 'siteincharge', 'hr', 'sbuhead', 'admin'];

    if (dashboardViews.includes(currentView) && currentUser) {
      return (
        <div className="flex min-h-screen">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userRole={currentUser.role}
          />
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
            {(() => {
              switch (currentView) {
                case 'employee':
                  return <EmployeeDashboard key="employee" user={currentUser} onLogout={handleLogout} activeSection={activeSection} />;
                case 'siteincharge':
                  return <SiteInchargeDashboard key="siteincharge" user={currentUser} onLogout={handleLogout} activeSection={activeSection} />;
                case 'hr':
                  return <HRDashboard key="hr" user={currentUser} onLogout={handleLogout} activeSection={activeSection} />;
                case 'sbuhead':
                  return <SBUHeadDashboard key="sbuhead" user={currentUser} onLogout={handleLogout} activeSection={activeSection} />;
                case 'admin':
                  return <AdminDashboard key="admin" user={currentUser} onLogout={handleLogout} activeSection={activeSection} />;
                default:
                  return <Landing key="default" onNavigateToLogin={() => setCurrentView('login')} />;
              }
            })()}
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'landing':
        return <Landing key="landing" onNavigateToLogin={() => setCurrentView('login')} />;
      case 'login':
        return <Login key="login" onLogin={handleLogin} onNavigate={setCurrentView} />;
      case 'forgot':
        return <ForgotPassword key="forgot" onNavigate={setCurrentView} />;
      default:
        return <Landing key="default" onNavigateToLogin={() => setCurrentView('login')} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Leave Management System - RITES</title>
        <meta name="description" content="Complete leave management system with multi-level approval workflow for efficient leave tracking and management" />
      </Helmet>
      <div className="min-h-screen gradient-bg text-white fade-in">
        <div className="parallax-train"></div>
        <div className="track-line fixed bottom-0 w-full h-2 z-10"></div>
        <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 shadow-lg hover-lift transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md text-black border-b border-gray-200' : 'bg-transparent text-white'}`}>
          <div className="flex items-center">
            <img src={logo} alt="RITES Logo" className={`h-12 w-auto logo-animated transition-all duration-300 ${isScrolled ? 'filter invert' : ''}`} />
            <h1 className={`ml-4 text-xl md:text-2xl font-bold transition-all duration-300 ${isScrolled ? 'text-black' : 'led-text'}`}>RITES Leave Management</h1>
          </div>
        </header>
        <main className="pt-20 p-4 md:p-6 lg:p-8 slide-up">
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

        {/* Footer with Credits */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative bg-gradient-to-r from-rites-green-900 via-rites-blue-900 to-rites-green-900 text-white py-8 mt-12"
        >
          {/* Thin Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6"></div>

          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-2"
            >
              <p className="text-lg font-semibold">
                <span className="font-bold text-rites-green-300">Created & Developed by:</span> <span className="font-bold">Abhijeet Mohan Mishra</span> <span className="text-sm text-rites-blue-200">(IT Engineer – Bhilai)</span>
              </p>
              <p className="text-lg font-semibold">
                <span className="font-bold text-rites-green-300">Concept & Idea by:</span> <span className="font-bold">Veeravalli Sri Ram Kumar</span> <span className="text-sm text-rites-blue-200">(Assistant – HR)</span>
              </p>
            </motion.div>
          </div>
        </motion.footer>

        <Toaster />
      </div>
    </>
  );
  }
  
  export default App;
