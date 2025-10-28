import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroImage from './HeroImage';
import WelcomeMessage from './WelcomeMessage';
import CallToAction from './CallToAction';
import { Button } from '@/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const Landing = ({ onNavigateToLogin }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const particleArray = [];
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8,
      });
    }
    setParticles(particleArray);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Particle Background */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroImage />

        {/* Enhanced Content Overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          variants={itemVariants}
        >
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Welcome to RITES LMS</span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent animate-glow"
              variants={itemVariants}
            >
              RITES
            </motion.h1>

            <motion.div
              className="text-2xl md:text-4xl font-light mb-8 text-white/90"
              variants={itemVariants}
            >
              Leave Management System
            </motion.div>

            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-8 animate-pulse"
              variants={itemVariants}
            />
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto mb-12"
            variants={itemVariants}
          >
            <WelcomeMessage />
            <CallToAction />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Button
              onClick={onNavigateToLogin}
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <motion.div
              className="text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Streamline your leave management process
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
