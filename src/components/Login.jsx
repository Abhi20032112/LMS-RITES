import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const Login = ({ onLogin, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');

  const roles = ['Employee', 'Site Incharge', 'HR', 'SBU Head', 'Admin'];

  // Reset role selection on component mount
  useEffect(() => {
    setSelectedRole('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let user;
    if (selectedRole === 'Employee') {
      // Employees login via localStorage (created by admins)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      user = users.find(u => u.empId === empId && u.role === 'Employee');
      if (!user) {
        toast({
          title: "Login Failed",
          description: "Invalid Employee ID",
          variant: "destructive",
        });
        return;
      }
    } else if (selectedRole === 'Admin') {
      try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: empId, password }),
        });
        const data = await response.json();
        if (data.success) {
          user = data.user;
        } else {
          toast({
            title: "Login Failed",
            description: data.message || "Invalid credentials",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Login Failed",
          description: "Unable to connect to server",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Other roles login via localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      user = users.find(u => u.empId === empId && u.password === password && u.role === selectedRole);
    }

    if (user) {
      toast({
        title: "Login Successful! 🎉",
        description: `Welcome back, ${user.name}! Role: ${selectedRole}`,
      });
      onLogin(user);
    } else {
      toast({
        title: "Login Failed",
        description: selectedRole === 'Employee' ? "Invalid Emp No." : "Invalid Employee ID, password, or role",
        variant: "destructive",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 1 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/30 card-hover relative overflow-hidden">
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-5"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #059669 0%, transparent 50%), radial-gradient(circle at 40% 40%, #047857 0%, transparent 50%)',
              backgroundSize: '200% 200%',
            }}
          />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400/20 rounded-full"
              style={{
                top: `${20 + i * 10}%`,
                left: `${10 + i * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Leave Management</h1>
            <p className="text-gray-600">Sign in to continue</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.label
              className="block text-sm font-medium mb-2 text-gray-700"
              variants={itemVariants}
            >
              Select Your Role
            </motion.label>
            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <motion.select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                required
                whileFocus={{ scale: 1.02 }}
                variants={itemVariants}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </motion.select>
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <motion.label
                className="block text-sm font-medium mb-2 text-gray-700"
                variants={itemVariants}
              >
                Emp No.
              </motion.label>
              <motion.div
                className="relative"
                variants={itemVariants}
              >
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <motion.input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Enter your Emp No."
                  required
                  whileFocus={{ scale: 1.02 }}
                  variants={itemVariants}
                />
              </motion.div>
            </motion.div>

            {selectedRole !== 'Employee' && (
              <motion.div variants={itemVariants}>
                <motion.label
                  className="block text-sm font-medium mb-2 text-gray-700"
                  variants={itemVariants}
                >
                  Password
                </motion.label>
                <motion.div
                  className="relative"
                  variants={itemVariants}
                >
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                    whileFocus={{ scale: 1.02 }}
                    variants={itemVariants}
                  />
                </motion.div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl btn-hover shadow-xl hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={false}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <LogIn className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Sign In</span>
              </Button>
            </motion.div>
          </motion.form>

          {selectedRole !== 'Employee' && (
            <div className="text-center mt-4">
              <button
                onClick={() => onNavigate('forgot')}
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
