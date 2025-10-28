import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';

const CallToAction = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-grade security for your data',
      color: 'text-green-400',
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Manage leaves anytime, anywhere',
      color: 'text-blue-400',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless approval workflows',
      color: 'text-purple-400',
    },
  ];

  return (
    <motion.div
      className='text-center mt-12 space-y-8'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Feature Cards */}
      <motion.div
        className='grid md:grid-cols-3 gap-6 mb-12'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className='bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300'
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
          >
            <motion.div
              className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 ${feature.color}`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <feature.icon className='w-6 h-6' />
            </motion.div>
            <h3 className='text-lg font-semibold text-white mb-2'>{feature.title}</h3>
            <p className='text-white/80 text-sm'>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className='space-y-6'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.h3
          className='text-2xl md:text-3xl font-bold text-white'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.7 }}
        >
          Ready to Transform Your Leave Management?
        </motion.h3>

        <motion.p
          className='text-lg text-white/90 max-w-2xl mx-auto'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.9 }}
        >
          Join thousands of RITES employees who have already streamlined their leave processes.
          Experience the difference today.
        </motion.p>

        <motion.div
          className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
        >
          <motion.button
            className='group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </motion.button>

          <motion.button
            className='group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full border border-white/30 transition-all duration-300 flex items-center gap-2'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
            <motion.div
              className='w-2 h-2 bg-white rounded-full'
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className='flex flex-wrap justify-center items-center gap-6 mt-8 text-white/60 text-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
        >
          <span className='flex items-center gap-2'>
            <Shield className='w-4 h-4' />
            SOC 2 Compliant
          </span>
          <span className='flex items-center gap-2'>
            <Users className='w-4 h-4' />
            10,000+ Users
          </span>
          <span className='flex items-center gap-2'>
            <Clock className='w-4 h-4' />
            99.9% Uptime
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CallToAction;
