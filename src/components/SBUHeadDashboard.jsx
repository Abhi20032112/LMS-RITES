import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const SBUHeadDashboard = ({ user, onLogout }) => {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    setPendingRequests(requests.filter(r => r.sbuHead === 'Pending' && r.hr === 'Approved'));
  };

  const handleApproval = (leaveId, action) => {
    const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    const requestIndex = requests.findIndex(r => r.leaveId === leaveId);

    if (requestIndex !== -1) {
      requests[requestIndex].sbuHead = action;
      
      if (action === 'Approved') {
        requests[requestIndex].finalStatus = 'Approved (Final)';
      } else {
        requests[requestIndex].finalStatus = 'Rejected by SBU Head';
      }

      localStorage.setItem('leaveRequests', JSON.stringify(requests));
      
      toast({
        title: action === 'Approved' ? "Request Approved! ✅" : "Request Rejected! ❌",
        description: `Leave request has been ${action.toLowerCase()}`,
      });

      loadRequests();
    }
  };

  const exportToExcel = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');

    let csvContent = "USERS DATA\n";
    csvContent += "Emp ID,Name,Designation,Role,CL Balance,CO Balance\n";
    users.forEach(u => {
      csvContent += `${u.empId},${u.name},${u.designation},${u.role},${u.clBalance},${u.coBalance}\n`;
    });

    csvContent += "\n\nLEAVE REQUESTS DATA\n";
    csvContent += "Leave ID,Emp ID,Name,Leave Type,From,To,Days,Site Incharge,HR,SBU Head,Final Status,Remarks\n";
    requests.forEach(r => {
      csvContent += `${r.leaveId},${r.empId},${r.name},${r.leaveType},${r.from},${r.to},${r.days},${r.siteIncharge},${r.hr},${r.sbuHead},${r.finalStatus},${r.remarks || ''}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_management_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Data Exported! 📊",
      description: "Excel file has been downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-white/20 card-hover"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SBU Head Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 card-hover"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Final Approvals</h2>

          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No pending requests</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Employee</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Leave Type</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">From</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">To</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Days</th>
                    <th className="text-left text-gray-700 py-3 px-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((request) => (
                    <tr key={request.leaveId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-gray-900 font-semibold">{request.name}</p>
                          <p className="text-gray-600 text-sm">{request.designation}</p>
                        </div>
                      </td>
                      <td className="text-gray-900 py-3 px-2">{request.leaveType}</td>
                      <td className="text-gray-900 py-3 px-2">{new Date(request.from).toLocaleDateString()}</td>
                      <td className="text-gray-900 py-3 px-2">{new Date(request.to).toLocaleDateString()}</td>
                      <td className="text-gray-900 py-3 px-2">{request.days}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproval(request.leaveId, 'Approved')}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleApproval(request.leaveId, 'Rejected')}
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
      </div>
    </div>
  );
};

export default SBUHeadDashboard;