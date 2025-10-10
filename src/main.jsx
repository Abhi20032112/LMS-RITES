import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const initializeApp = () => {
  const users = localStorage.getItem('users');
  if (!users) {
    const defaultUsers = [
      {
        empId: 'EMP001',
        name: 'John Doe',
        designation: 'Software Engineer',
        role: 'Employee',
        password: 'password123',
        clBalance: 12,
        coBalance: 0,
      },
      {
        empId: 'SI001',
        name: 'Jane Smith',
        designation: 'Site Manager',
        role: 'Site Incharge',
        password: 'password123',
        clBalance: 12,
        coBalance: 0,
      },
      {
        empId: 'HR001',
        name: 'Mike Johnson',
        designation: 'HR Manager',
        role: 'HR',
        password: 'password123',
        clBalance: 12,
        coBalance: 0,
      },
      {
        empId: 'SBU001',
        name: 'Sarah Williams',
        designation: 'SBU Head',
        role: 'SBU Head',
        password: 'password123',
        clBalance: 12,
        coBalance: 0,
      },
      {
        empId: 'ADMIN001',
        name: 'Admin User',
        designation: 'Administrator',
        role: 'Admin',
        password: 'password123',
        clBalance: 12,
        coBalance: 0,
      },
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  const leaveRequests = localStorage.getItem('leaveRequests');
  if (!leaveRequests) {
    localStorage.setItem('leaveRequests', JSON.stringify([]));
  }
};

initializeApp();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);