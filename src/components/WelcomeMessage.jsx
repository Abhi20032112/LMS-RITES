import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <motion.div
      className='text-center max-w-3xl mx-auto space-y-6'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <motion.div
        className='flex items-center justify-center gap-3 mb-4'
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 1, type: 'spring', stiffness: 200 }}
      >
        <Sparkles className='w-8 h-8 text-yellow-400 animate-pulse' />
        <span className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-glow'>
          Welcome to
        </span>
        <Sparkles className='w-8 h-8 text-yellow-400 animate-pulse' />
      </motion.div>

      <motion.h2
        className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        RITES LMS
      </motion.h2>

      <motion.p
        className='text-lg md:text-xl text-white/90 leading-relaxed'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        Experience the future of leave management with our cutting-edge platform designed specifically for
        <span className='font-semibold text-green-300'> RITES employees</span>.
      </motion.p>

      <motion.div
        className='flex items-center justify-center gap-2 text-white/80'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <Zap className='w-5 h-5 text-orange-400' />
        <span className='text-base md:text-lg'>
          Streamline your leave requests and approvals with ease
        </span>
        <Zap className='w-5 h-5 text-orange-400' />
      </motion.div>

      <motion.div
        className='flex flex-wrap justify-center gap-4 mt-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        {['Fast', 'Secure', 'User-Friendly'].map((feature, index) => (
          <motion.span
            key={feature}
            className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20'
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {feature}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default WelcomeMessage;
