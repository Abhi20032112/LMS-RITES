import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Eye, UserPlus, Users, Trash2 } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const AdminDashboard = ({ user, onLogout }) => {
  const [allRequests, setAllRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('createUser');
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    designation: '',
    role: 'Employee',
    password: '',
    confirmPassword: '',
    clBalance: 12,
    coBalance: 0,
    securityQuestion: '',
    securityAnswer: '',
  });

  // Check if current admin is authorized
  const isAuthorizedAdmin = user && (user.empId === '99508' || user.empId === '13566');

  useEffect(() => {
    if (!isAuthorizedAdmin) {
      toast({
        title: "Access Denied",
        description: "Only authorized admins can access this dashboard.",
        variant: "destructive",
      });
      return;
    }
    loadRequests();
    loadUsers();
  }, [isAuthorizedAdmin]);

  const loadRequests = () => {
    const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    setAllRequests(requests);
  };

  const loadUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setAllUsers(users);
  };

  const getStatusColor = (status) => {
    if (status.includes('Approved')) return 'text-green-600';
    if (status.includes('Rejected')) return 'text-red-600';
    return 'text-yellow-600';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthorizedAdmin) {
      toast({
        title: "Access Denied",
        description: "Only authorized admins can create new employee IDs.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empId: formData.empId,
          name: formData.name,
          designation: formData.designation,
          role: formData.role,
          password: formData.password,
          clBalance: formData.clBalance,
          coBalance: formData.coBalance,
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadUsers();
        toast({
          title: "User Created! 🎉",
          description: `User created for ${formData.name} (ID: ${formData.empId})`,
        });

        setFormData({
          empId: '',
          name: '',
          designation: '',
          role: 'Employee',
          password: '',
          confirmPassword: '',
          clBalance: 12,
          coBalance: 0,
          securityQuestion: '',
          securityAnswer: '',
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUser = (empId) => {
    if (!isAuthorizedAdmin) {
      toast({
        title: "Access Denied",
        description: "Only authorized admins can remove employees.",
        variant: "destructive",
      });
      return;
    }

    if (empId === '99508' || empId === '13566') {
      toast({
        title: "Cannot Remove Admin",
        description: "Cannot remove admin accounts.",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.empId !== empId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    loadUsers();

    toast({
      title: "User Removed",
      description: `Employee ID ${empId} has been removed.`,
    });
  };

  if (!isAuthorizedAdmin) {
    return (
      <motion.div
        className="min-h-screen gradient-bg p-4 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/80">You do not have permission to access this dashboard.</p>
          <Button onClick={onLogout} className="mt-4 bg-red-600 hover:bg-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen gradient-bg p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card p-6 mb-6"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-white">Welcome, {user.name}! You have access to all data.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="track-separator"></div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-white/20 card-hover"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-green-700" />
            Create New Employee
          </h2>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="grid grid-cols-1 739:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
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
              </motion.div>

              <motion.div variants={itemVariants}>
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
              </motion.div>

              <motion.div variants={itemVariants}>
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
              </motion.div>

              <motion.div variants={itemVariants}>
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
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
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
              </motion.div>

              <motion.div variants={itemVariants}>
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
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-2 text-gray-700">CL Balance</label>
                <input
                  type="number"
                  name="clBalance"
                  value={formData.clBalance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="12"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-2 text-gray-700">CO Balance</label>
                <input
                  type="number"
                  name="coBalance"
                  value={formData.coBalance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="0"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Security Question</label>
                <input
                  type="text"
                  name="securityQuestion"
                  value={formData.securityQuestion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="What is your mother's maiden name?"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Security Answer</label>
                <input
                  type="text"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Answer to security question"
                  required
                />
              </motion.div>
            </motion.div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg btn-hover shadow-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Employee
            </Button>
          </motion.form>
        </motion.div>

        <div className="track-separator"></div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-white/20 card-hover"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Users className="w-6 h-6 mr-2 text-green-700" />
            All Employees
          </motion.h2>

          {allUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No employees found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-rites">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Role</th>
                    <th>Password</th>
                    <th>CL Balance</th>
                    <th>CO Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {allUsers.map((user, index) => (
                    <motion.tr
                      key={user.empId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                    >
                      <td className="text-gray-900 py-3 px-2">{user.empId}</td>
                      <td className="text-gray-900 py-3 px-2">{user.name}</td>
                      <td className="text-gray-900 py-3 px-2">{user.designation}</td>
                      <td className="text-gray-900 py-3 px-2">{user.role}</td>
                      <td className="text-gray-900 py-3 px-2">{user.password}</td>
                      <td className="text-gray-900 py-3 px-2">{user.clBalance}</td>
                      <td className="text-gray-900 py-3 px-2">{user.coBalance}</td>
                      <td className="py-3 px-2">
                        {user.empId !== '99508' && user.empId !== '13566' && (
                          <Button
                            onClick={() => handleRemoveUser(user.empId)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-white/20 card-hover"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Eye className="w-6 h-6 mr-2 text-green-700" />
            All Leave Requests
          </motion.h2>

          <div className="mb-4">
            <Button
              onClick={() => window.open('http://localhost:5000/api/download/excel', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Download Report (Excel)
            </Button>
          </div>

          {allRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No leave requests found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-rites">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Site Incharge</th>
                    <th>HR</th>
                    <th>SBU Head</th>
                    <th>Final Status</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {allRequests.map((request, index) => (
                    <motion.tr
                      key={request.leaveId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                    >
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-gray-900 font-semibold">{request.name}</p>
                          <p className="text-gray-600 text-sm">{request.designation}</p>
                          <p className="text-gray-500 text-xs">ID: {request.empId}</p>
                        </div>
                      </td>
                      <td className="text-gray-900 py-3 px-2">{request.leaveType}</td>
                      <td className="text-gray-900 py-3 px-2">{new Date(request.from).toLocaleDateString()}</td>
                      <td className="text-gray-900 py-3 px-2">{new Date(request.to).toLocaleDateString()}</td>
                      <td className="text-gray-900 py-3 px-2">{request.days}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-medium ${
                          request.siteIncharge === 'Approved' ? 'signal-approved' :
                          request.siteIncharge === 'Rejected' ? 'signal-rejected' :
                          'signal-pending'
                        }`}>
                          {request.siteIncharge}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-medium ${
                          request.hr === 'Approved' ? 'signal-approved' :
                          request.hr === 'Rejected' ? 'signal-rejected' :
                          'signal-pending'
                        }`}>
                          {request.hr}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-medium ${
                          request.sbuHead === 'Approved' ? 'signal-approved' :
                          request.sbuHead === 'Rejected' ? 'signal-rejected' :
                          'signal-pending'
                        }`}>
                          {request.sbuHead}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`font-semibold ${getStatusColor(request.finalStatus)} ${
                          request.finalStatus.includes('Approved') ? 'signal-approved' :
                          request.finalStatus.includes('Rejected') ? 'signal-rejected' :
                          'signal-pending'
                        }`}>
                          {request.finalStatus}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </motion.div>


      </div>
    </motion.div>
  );
};

export default AdminDashboard;
