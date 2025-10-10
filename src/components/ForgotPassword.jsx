import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';

const ForgotPassword = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [empId, setEmpId] = useState('');
  const [user, setUser] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNextStep1 = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.empId === empId);

    if (!foundUser) {
      toast({
        title: "Employee Not Found",
        description: "No account found with this Employee ID",
        variant: "destructive",
      });
      return;
    }

    setUser(foundUser);
    setStep(2);
  };

  const handleVerifyAnswer = () => {
    if (!securityAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please enter the answer to the security question",
        variant: "destructive",
      });
      return;
    }

    if (user.securityAnswer?.toLowerCase() !== securityAnswer.toLowerCase()) {
      toast({
        title: "Incorrect Answer",
        description: "The answer to the security question is incorrect",
        variant: "destructive",
      });
      return;
    }

    setStep(3);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.empId === empId);
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    toast({
      title: "Password Reset Successful! 🎉",
      description: `Password reset for Employee ID: ${empId}`,
    });

    onNavigate('login');
  };

  const handleBack = () => {
    if (step === 1) {
      onNavigate('login');
    } else {
      setStep(step - 1);
      if (step === 2) {
        setSecurityAnswer('');
      } else if (step === 3) {
        setNewPassword('');
        setConfirmPassword('');
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
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Reset Password</h1>
            <p className="text-gray-600">
              {step === 1 && "Enter your Employee ID"}
              {step === 2 && "Answer your security question"}
              {step === 3 && "Set a new password"}
            </p>
          </motion.div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Employee ID</label>
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Enter your Employee ID"
                />
              </div>
              <Button
                onClick={handleNextStep1}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg btn-hover shadow-lg"
              >
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Security Question</label>
                <p className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  {user.securityQuestion}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Answer</label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Enter your answer"
                />
              </div>
              <Button
                onClick={handleVerifyAnswer}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg btn-hover shadow-lg"
              >
                Verify Answer
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                onClick={handleResetPassword}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg btn-hover shadow-lg"
              >
                <Key className="w-5 h-5 mr-2" />
                Reset Password
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
