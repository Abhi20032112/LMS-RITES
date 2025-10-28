import React from 'react';
import { motion } from 'framer-motion';

const HeroImage = () => {
  return (
    <div className="relative overflow-hidden h-screen flex items-center justify-center">
      {/* Enhanced Parallax Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><rect x=\'0\' y=\'40\' width=\'100\' height=\'20\' fill=\'%23008000\'/><circle cx=\'20\' cy=\'70\' r=\'10\' fill=\'%2300A859\'/><circle cx=\'80\' cy=\'70\' r=\'10\' fill=\'%2300A859\'/></svg>")',
          backgroundSize: '200px 100px',
          backgroundRepeat: 'repeat-x',
        }}
        animate={{
          x: [0, -200],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Multiple Moving Trains */}
      <motion.div
        className="absolute bottom-20 left-0 w-32 h-16"
        style={{
          backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 100\'><rect x=\'10\' y=\'30\' width=\'180\' height=\'40\' fill=\'%23008000\'/><circle cx=\'50\' cy=\'70\' r=\'15\' fill=\'%2300A859\'/><circle cx=\'150\' cy=\'70\' r=\'15\' fill=\'%2300A859\'/><rect x=\'0\' y=\'50\' width=\'20\' height=\'20\' fill=\'%2300A859\'/></svg>")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
        animate={{
          x: ['-100%', '100vw'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Second Train */}
      <motion.div
        className="absolute bottom-32 right-0 w-28 h-14 opacity-60"
        style={{
          backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 100\'><rect x=\'10\' y=\'30\' width=\'180\' height=\'40\' fill=\'%233b82f6\'/><circle cx=\'50\' cy=\'70\' r=\'12\' fill=\'%2360a5fa\'/><circle cx=\'150\' cy=\'70\' r=\'12\' fill=\'%2360a5fa\'/><rect x=\'0\' y=\'50\' width=\'18\' height=\'18\' fill=\'%2360a5fa\'/></svg>")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
        animate={{
          x: ['100vw', '-100%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
          delay: 3,
        }}
      />

      {/* Hero Text */}
      <motion.div
        className="text-center text-white z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 gradient-text">
          RITES
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Leave Management System
        </p>
        <motion.div
          className="track-line mx-auto w-64 h-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </motion.div>

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-sm"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-lg blur-sm"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-40 left-32 w-20 h-8 bg-gradient-to-r from-green-400/20 to-teal-500/20 rounded-full blur-sm"
        animate={{
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Enhanced Signal Lights */}
      <motion.div
        className="absolute top-20 right-20 w-6 h-6 bg-green-400 rounded-full shadow-lg"
        animate={{
          opacity: [0.3, 1, 0.3],
          boxShadow: [
            '0 0 10px rgba(34, 197, 94, 0.5)',
            '0 0 20px rgba(34, 197, 94, 0.8)',
            '0 0 10px rgba(34, 197, 94, 0.5)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-40 left-20 w-5 h-5 bg-blue-400 rounded-full shadow-lg"
        animate={{
          opacity: [0.3, 1, 0.3],
          boxShadow: [
            '0 0 8px rgba(59, 130, 246, 0.5)',
            '0 0 16px rgba(59, 130, 246, 0.8)',
            '0 0 8px rgba(59, 130, 246, 0.5)',
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute bottom-32 right-40 w-4 h-4 bg-orange-400 rounded-full shadow-lg"
        animate={{
          opacity: [0.3, 1, 0.3],
          boxShadow: [
            '0 0 6px rgba(249, 115, 22, 0.5)',
            '0 0 12px rgba(249, 115, 22, 0.8)',
            '0 0 6px rgba(249, 115, 22, 0.5)',
          ],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Animated Track Lines */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-400 to-transparent"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"
        animate={{
          backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
          delay: 1,
        }}
      />
    </div>
  );
};

export default HeroImage;
