import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, CheckCircle, XCircle, Users } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const SiteInchargeDashboard = ({ user, onLogout }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadRequests();
    loadUsers();
  }, []);

  const loadUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setAllUsers(users);
  };

  const loadRequests = () => {
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]').filter(r => r.siteIncharge === 'Pending');
    const cancelRequests = JSON.parse(localStorage.getItem('cancelRequests') || '[]').filter(r => r.siteIncharge === 'Pending');
    const allRequests = [...leaveRequests.map(r => ({ ...r, type: 'Leave' })), ...cancelRequests.map(r => ({ ...r, type: 'Cancel' }))];
    setPendingRequests(allRequests);
  };

  const handleApproval = (request, action) => {
    if (request.type === 'Leave') {
      const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
      const requestIndex = requests.findIndex(r => r.leaveId === request.leaveId);

      if (requestIndex !== -1) {
        requests[requestIndex].siteIncharge = action;

        if (action === 'Approved') {
          requests[requestIndex].finalStatus = 'Pending at HR';
        } else {
          requests[requestIndex].finalStatus = 'Rejected by Site Incharge';
        }

        localStorage.setItem('leaveRequests', JSON.stringify(requests));
      }
    } else {
      const cancelRequests = JSON.parse(localStorage.getItem('cancelRequests') || '[]');
      const requestIndex = cancelRequests.findIndex(r => r.cancelId === request.cancelId);

      if (requestIndex !== -1) {
        cancelRequests[requestIndex].siteIncharge = action;

        if (action === 'Approved') {
          cancelRequests[requestIndex].finalStatus = 'Pending at HR';
        } else {
          cancelRequests[requestIndex].finalStatus = 'Rejected by Site Incharge';
        }

        localStorage.setItem('cancelRequests', JSON.stringify(cancelRequests));
      }
    }

    toast({
      title: action === 'Approved' ? "Request Approved! ✅" : "Request Rejected! ❌",
      description: `${request.type} request has been ${action.toLowerCase()}`,
    });

    loadRequests();
  };

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Site Incharge Dashboard</h1>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold gradient-text mb-6">Pending Approvals</h2>

          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No pending requests</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Employee</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Type</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Leave Type</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">From</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">To</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Days</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Reason</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((request) => (
                    <tr key={request.cancelId || request.leaveId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-gray-900 font-semibold">{request.name}</p>
                          <p className="text-gray-600 text-sm">{request.designation}</p>
                        </div>
                      </td>
                      <td className="text-gray-900 py-3 px-2">{request.type}</td>
                      <td className="text-gray-900 py-3 px-2">{request.leaveType}</td>
                      <td className="text-gray-900 py-3 px-2">{new Date(request.from).toLocaleDateString()}</td>
                      <td className="text-gray-900 py-3 px-2">{new Date(request.to).toLocaleDateString()}</td>
                      <td className="text-gray-900 py-3 px-2">{request.days}</td>
                      <td className="text-gray-900 py-3 px-2">{request.type === 'Cancel' ? request.reason : '-'}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproval(request, 'Approved')}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleApproval(request, 'Rejected')}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                            size="sm"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            All Employees
          </h2>

          {allUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No employees found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Emp ID</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Name</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Designation</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Role</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">CL Balance</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">CO Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.empId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="text-gray-900 py-3 px-2">{user.empId}</td>
                      <td className="text-gray-900 py-3 px-2">{user.name}</td>
                      <td className="text-gray-900 py-3 px-2">{user.designation}</td>
                      <td className="text-gray-900 py-3 px-2">{user.role}</td>
                      <td className="text-gray-900 py-3 px-2">{user.clBalance}</td>
                      <td className="text-gray-900 py-3 px-2">{user.coBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SiteInchargeDashboard;