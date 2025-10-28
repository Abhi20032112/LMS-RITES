import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut,
  Eye,
  UserPlus,
  Users,
  Trash2,
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';
import Sidebar from './Sidebar';
import InfoCard from './InfoCard';
import ProgressChart from './ProgressChart';

const AdminDashboardNew = ({ user, onLogout }) => {
  const [allRequests, setAllRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
