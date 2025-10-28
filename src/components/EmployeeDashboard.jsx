import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Plus, Trash2, Calendar, FileText } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([
    { type: 'Casual Leave', from: '', to: '', days: 0 }
  ]);

  useEffect(() => {
    const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    setLeaveRequests(requests.filter(r => r.empId === user.empId));
  }, [user.empId]);

  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleDateChange = (index, field, value) => {
    const updated = [...leaveTypes];
    updated[index][field] = value;
    
    if (field === 'from' || field === 'to') {
      updated[index].days = calculateDays(updated[index].from, updated[index].to);
    }
    
    setLeaveTypes(updated);
  };

  const addLeaveType = () => {
    setLeaveTypes([...leaveTypes, { type: 'Casual Leave', from: '', to: '', days: 0 }]);
  };

  const removeLeaveType = (index) => {
    setLeaveTypes(leaveTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const promises = leaveTypes.map(leave =>
        fetch('http://localhost:5000/api/leave/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            empId: user.empId,
            name: user.name,
            designation: user.designation,
            leaveType: leave.type,
            from: leave.from,
            to: leave.to,
            days: leave.days,
          }),
        })
      );

      await Promise.all(promises);

      toast({
        title: "Leave Submitted! 🎉",
        description: `Leave request submitted: ${leaveTypes.map(l => `${l.type} (${l.from} to ${l.to})`).join(', ')}`,
      });

      setLeaveTypes([{ type: 'Casual Leave', from: '', to: '', days: 0 }]);

      // Refresh leave requests
      const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
      setLeaveRequests(requests.filter(r => r.empId === user.empId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = (leaveId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    const allCancelRequests = JSON.parse(localStorage.getItem('cancelRequests') || '[]');
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    const leave = leaveRequests.find(r => r.leaveId === leaveId);

    if (leave) {
      const cancelRequest = {
        cancelId: `CL${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        leaveId: leaveId,
        empId: leave.empId,
        name: leave.name,
        designation: leave.designation,
        leaveType: leave.leaveType,
        from: leave.from,
        to: leave.to,
        days: leave.days,
        reason: reason,
        siteIncharge: 'Pending',
        hr: 'Pending',
        sbuHead: 'Pending',
        finalStatus: 'Pending at Site Incharge',
        submittedDate: new Date().toISOString(),
      };

      allCancelRequests.push(cancelRequest);
      localStorage.setItem('cancelRequests', JSON.stringify(allCancelRequests));

      toast({
        title: "Cancel Request Submitted! 📝",
        description: `Cancel request for ${leave.leaveType} submitted`,
      });
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('Approved')) return 'text-green-400';
    if (status.includes('Rejected')) return 'text-red-400';
    return 'text-yellow-400';
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

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Employee Dashboard</h1>
              <p className="text-white">Welcome, {user.name}!</p>
            </div>
            <Button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-green-100 rounded-lg p-4 border border-green-300 card-hover"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <p className="text-green-700 text-sm font-medium">Employee ID</p>
              <p className="text-gray-900 font-bold text-lg">{user.empId}</p>
            </motion.div>
            <motion.div
              className="bg-green-200 rounded-lg p-4 border border-green-400 card-hover"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <p className="text-green-800 text-sm font-medium">Designation</p>
              <p className="text-gray-900 font-bold text-lg">{user.designation}</p>
            </motion.div>
            <motion.div
              className="bg-green-300 rounded-lg p-4 border border-green-500 card-hover"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <p className="text-green-900 text-sm font-medium">CL Balance</p>
              <p className="text-gray-900 font-bold text-lg">{user.clBalance}</p>
            </motion.div>
            <motion.div
              className="bg-green-400 rounded-lg p-4 border border-green-600 card-hover"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <p className="text-green-700 text-sm font-medium">CO Balance</p>
              <p className="text-gray-900 font-bold text-lg">{user.coBalance}</p>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 card-hover"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-700" />
              Apply for Leave
            </h2>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {leaveTypes.map((leave, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-100 rounded-lg p-4 space-y-3 border border-gray-300 card-hover"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 font-semibold">Leave #{index + 1}</h3>
                    {leaveTypes.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={() => removeLeaveType(index)}
                        className="text-red-600 hover:text-red-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Leave Type</label>
                    <select
                      value={leave.type}
                      onChange={(e) => handleDateChange(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      required
                    >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="CO Leave">CO Leave</option>
                    <option value="Half CL">Half CL</option>
                    <option value="LWP">LWP</option>
                    <option value="GH">GH</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">From</label>
                      <input
                        type="date"
                        value={leave.from}
                        onChange={(e) => handleDateChange(index, 'from', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">To</label>
                      <input
                        type="date"
                        value={leave.to}
                        onChange={(e) => handleDateChange(index, 'to', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Days</label>
                    <input
                      type="number"
                      value={leave.days}
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                </motion.div>
              ))}

              <Button
                type="button"
                onClick={addLeaveType}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Leave Type
              </Button>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                Submit Leave Request
              </Button>
            </motion.form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 card-hover"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-green-700" />
              Approved Leaves
            </h2>

            <motion.div
              className="space-y-3 max-h-96 overflow-y-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {leaveRequests.filter(r => r.finalStatus === 'Approved (Final)').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No approved leaves</p>
              ) : (
                leaveRequests.filter(r => r.finalStatus === 'Approved (Final)').map((request, index) => (
                  <motion.div
                    key={request.leaveId}
                    className="bg-gray-100 rounded-lg p-4 border border-gray-300 card-hover"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-900 font-semibold">{request.leaveType}</p>
                        <p className="text-gray-600 text-sm">
                          {new Date(request.from).toLocaleDateString()} - {new Date(request.to).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-white bg-gradient-to-r from-green-600 to-green-700 px-2 py-1 rounded text-xs font-medium">
                        {request.days} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm font-semibold ${getStatusColor(request.finalStatus)}`}>
                        {request.finalStatus}
                      </p>
                      <Button
                        onClick={() => handleCancel(request.leaveId)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 card-hover"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-green-700" />
                Leave History
              </h2>
              <Button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                size="sm"
              >
                {showHistory ? 'Hide' : 'Show'}
              </Button>
            </div>

            {showHistory && (
              <motion.div
                className="space-y-3 max-h-96 overflow-y-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {leaveRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No leave requests yet</p>
                ) : (
                  leaveRequests.map((request, index) => (
                    <motion.div
                      key={request.leaveId}
                      className="bg-gray-100 rounded-lg p-4 border border-gray-300 card-hover"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-gray-900 font-semibold">{request.leaveType}</p>
                          <p className="text-gray-600 text-sm">
                            {new Date(request.from).toLocaleDateString()} - {new Date(request.to).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-white bg-gradient-to-r from-green-600 to-green-700 px-2 py-1 rounded text-xs font-medium">
                          {request.days} days
                        </span>
                      </div>
                      <p className={`text-sm font-semibold ${getStatusColor(request.finalStatus)}`}>
                        {request.finalStatus}
                      </p>
                      {request.remarks && (
                        <p className="text-gray-600 text-xs mt-2">Remarks: {request.remarks}</p>
                      )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;