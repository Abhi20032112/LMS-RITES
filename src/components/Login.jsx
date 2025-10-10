import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const employees = [
  { empNo: '103741', name: 'Anup Kumar Gupta', designation: 'Technical Assistant', clBalance: 0, coBalance: 0 },
  { empNo: '103768', name: 'Dwarapudi Lahari', designation: 'Technical Assistant', clBalance: 0, coBalance: 2 },
  { empNo: '103782', name: 'Rongali Sai Bhargav', designation: 'Technical Assistant', clBalance: 0.5, coBalance: 0 },
  { empNo: '103742', name: 'Ch. Jagadeesh', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103739', name: 'Nisha Choudhary', designation: 'Technical Assistant', clBalance: 1, coBalance: 0 },
  { empNo: '103731', name: 'Abhinay Banjare', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103755', name: 'Rajat Das', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103779', name: 'Praveen Kolakaluri', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103764', name: 'Hari Haran Rachabattuni', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '104341', name: 'Ravi Pothumudi', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103749', name: 'Koushik Barik', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103772', name: 'Yograj', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '104322', name: 'Ayush Kumar', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103774', name: 'Akhilesh Mahto', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103744', name: 'Rup Kamal', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103747', name: 'Raj Kumar Singh', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103748', name: 'Lakesh Kumar', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103769', name: 'Ashwini Joshi', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103762', name: 'Sumit', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103763', name: 'Himanshu Sahu', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103788', name: 'Jagdish Badhai', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103729', name: 'Kuleshwar Yadav', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103726', name: 'Numendra Kumar Baidh', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103785', name: 'Nitesh Kumar', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '104325', name: 'Chaitanya Ram Sahu', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
  { empNo: '103759', name: 'Vikas Kumar Prasad', designation: 'Technical Assistant', clBalance: 1.5, coBalance: 0 },
];

const Login = ({ onLogin, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');

  const roles = ['Employee', 'Site Incharge', 'HR', 'SBU Head', 'Admin'];

  const handleSubmit = (e) => {
    e.preventDefault();

    let user;
    if (selectedRole === 'Employee') {
      const employee = employees.find(e => e.empNo === empId);
      if (employee) {
        user = {
          empId: employee.empNo,
          name: employee.name,
          designation: employee.designation,
          role: 'Employee',
          clBalance: employee.clBalance,
          coBalance: employee.coBalance,
        };
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      user = users.find(u => u.empId == empId && u.password === password && u.role === selectedRole);
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 card-hover">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Leave Management</h1>
            <p className="text-gray-600">Sign in to continue</p>
          </motion.div>

          <motion.div
            className="mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.label
              className="block text-sm font-medium mb-3 text-gray-700"
              variants={itemVariants}
            >
              Select Your Role
            </motion.label>
            <motion.div
              className="grid grid-cols-2 gap-2"
              variants={containerVariants}
            >
              {roles.map((role, index) => (
                <motion.button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedRole === role
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {role}
                </motion.button>
              ))}
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
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg btn-hover shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
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