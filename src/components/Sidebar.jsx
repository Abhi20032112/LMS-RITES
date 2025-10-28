import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  UserPlus,
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle, activeSection, onSectionChange, userRole }) => {
  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const itemVariants = {
    closed: {
      x: -20,
      opacity: 0
    },
    open: {
      x: 0,
      opacity: 1
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['all'] },
      { id: 'requests', label: 'Leave Requests', icon: FileText, roles: ['all'] },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'hr', 'sbuhead'] },
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'createUser', label: 'Create User', icon: UserPlus, roles: ['admin'] },
        { id: 'manageUsers', label: 'Manage Users', icon: Users, roles: ['admin'] },
        { id: 'reports', label: 'Reports', icon: Download, roles: ['admin'] },
      ],
      employee: [
        { id: 'applyLeave', label: 'Apply Leave', icon: Calendar, roles: ['employee'] },
        { id: 'myLeaves', label: 'My Leaves', icon: CheckCircle, roles: ['employee'] },
      ],
      siteincharge: [
        { id: 'pendingApprovals', label: 'Pending Approvals', icon: CheckCircle, roles: ['siteincharge'] },
        { id: 'approvedRequests', label: 'Approved Requests', icon: FileText, roles: ['siteincharge'] },
      ],
      hr: [
        { id: 'pendingApprovals', label: 'Pending Approvals', icon: CheckCircle, roles: ['hr'] },
        { id: 'rejectedRequests', label: 'Rejected Requests', icon: XCircle, roles: ['hr'] },
      ],
      sbuhead: [
        { id: 'finalApprovals', label: 'Final Approvals', icon: CheckCircle, roles: ['sbuhead'] },
        { id: 'exportData', label: 'Export Data', icon: Download, roles: ['sbuhead'] },
      ]
    };

    const userItems = roleSpecificItems[userRole.toLowerCase()] || [];
    return [...baseItems.filter(item => item.roles.includes('all') || item.roles.includes(userRole.toLowerCase())), ...userItems];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-lg shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-2xl z-50"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <motion.h2
            className="text-xl font-bold gradient-text"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            LMS Dashboard
          </motion.h2>
          <motion.p
            className="text-sm text-gray-600 mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {userRole} Panel
          </motion.p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <motion.ul
            className="space-y-2"
            initial="closed"
            animate="open"
            variants={{
              open: {
                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
              },
              closed: {
                transition: { staggerChildren: 0.05, staggerDirection: -1 }
              }
            }}
          >
            {menuItems.map((item, index) => (
              <motion.li
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => {
                    onSectionChange(item.id);
                    // Auto-close on mobile after selection
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <motion.div
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">RITES LMS</p>
              <p className="text-xs text-gray-600">v2.0</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
