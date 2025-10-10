import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const securityQuestions = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What elementary school did you attend?",
  "What is the name of the town where you were born?"
];

const Signup = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    designation: '',
    role: 'Employee',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    clBalance: 12,
    coBalance: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.empId === formData.empId)) {
      toast({
        title: "Employee ID Exists",
        description: "This Employee ID is already registered!",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      empId: formData.empId,
      name: formData.name,
      designation: formData.designation,
      role: formData.role,
      password: formData.password,
      securityQuestion: formData.securityQuestion,
      securityAnswer: formData.securityAnswer,
      clBalance: formData.clBalance,
      coBalance: formData.coBalance,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    toast({
      title: "Account Created! 🎉",
      description: `Account created for ${formData.name} (ID: ${formData.empId})`,
    });

    onNavigate('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 card-hover">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </button>

          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-gray-600">Join our leave management system</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Employee ID</label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="EMP001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 transition-all duration-300"
                  required
                >
                  <option value="Employee">Employee</option>
                  <option value="Site Incharge">Site Incharge</option>
                  <option value="HR">HR</option>
                  <option value="SBU Head">SBU Head</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Security Question</label>
                <select
                  name="securityQuestion"
                  value={formData.securityQuestion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 transition-all duration-300"
                  required
                >
                  <option value="">Select a security question</option>
                  {securityQuestions.map((question, index) => (
                    <option key={index} value={question}>{question}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Security Answer</label>
                <input
                  type="text"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Enter answer to security question"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg btn-hover shadow-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;