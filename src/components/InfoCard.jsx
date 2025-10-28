import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Train } from 'lucide-react';

const InfoCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'green',
  trend,
  trendValue,
  delay = 0,
  onClick,
  railwayTheme = true
}) => {
  const colorClasses = {
    green: {
      bg: 'from-green-500 to-green-600',
      lightBg: 'from-green-50 to-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      signal: 'signal-approved'
    },
    blue: {
      bg: 'from-blue-500 to-blue-600',
      lightBg: 'from-blue-50 to-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      signal: 'signal-pending'
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      lightBg: 'from-orange-50 to-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      signal: 'signal-warning'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      lightBg: 'from-red-50 to-red-100',
      text: 'text-red-600',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      signal: 'signal-rejected'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      lightBg: 'from-purple-50 to-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      signal: 'signal-pending'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group railway-card`}
    >
      {/* Railway Track Separator */}
      {railwayTheme && (
        <div className="track-separator absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60"></div>
      )}

      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.lightBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Animated border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colors.bg} p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        <div className="w-full h-full bg-white rounded-2xl" />
      </div>

      {/* Railway Signal Light */}
      {railwayTheme && (
        <motion.div
          className={`absolute top-3 right-3 w-3 h-3 rounded-full ${colors.signal} shadow-lg`}
          animate={{
            boxShadow: [
              `0 0 10px rgba(34, 197, 94, 0.5)`,
              `0 0 20px rgba(34, 197, 94, 0.8)`,
              `0 0 10px rgba(34, 197, 94, 0.5)`
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.iconBg} group-hover:scale-110 transition-transform duration-300 relative`}>
            <Icon className={`w-6 h-6 ${colors.iconColor}`} />
            {/* Electric spark effect */}
            {railwayTheme && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    `inset 0 0 5px rgba(34, 197, 94, 0.3)`,
                    `inset 0 0 15px rgba(34, 197, 94, 0.6)`,
                    `inset 0 0 5px rgba(34, 197, 94, 0.3)`
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </div>

          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend === 'up' ? 'bg-green-100 text-green-700 signal-approved' :
                trend === 'down' ? 'bg-red-100 text-red-700 signal-rejected' :
                'bg-gray-100 text-gray-700 signal-pending'
              }`}
            >
              <motion.span
                animate={trend === 'up' ? { y: [0, -2, 0] } : trend === 'down' ? { y: [0, 2, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
              </motion.span>
              <span>{trendValue}</span>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <motion.h3
            className="text-sm font-medium text-gray-600 uppercase tracking-wide flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            {railwayTheme && <Train className="w-3 h-3 mr-1 text-green-600" />}
            {title}
          </motion.h3>

          <motion.div
            className="flex items-baseline space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4, type: "spring", stiffness: 200 }}
          >
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {subtitle && (
              <span className="text-lg text-gray-600 font-medium">{subtitle}</span>
            )}
          </motion.div>

          {/* Railway Progress bar for percentage values */}
          {typeof value === 'string' && value.includes('%') && (
            <motion.div
              className="mt-3 relative"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: delay + 0.6, duration: 0.8 }}
            >
              <div className="w-full bg-gray-200 rounded-full h-3 railway-track">
                <motion.div
                  className={`h-3 rounded-full bg-gradient-to-r ${colors.bg} railway-progress`}
                  initial={{ width: 0 }}
                  animate={{ width: value }}
                  transition={{ delay: delay + 0.8, duration: 1, ease: "easeOut" }}
                />
                {/* Moving train effect */}
                {railwayTheme && (
                  <motion.div
                    className="absolute top-0 left-0 w-4 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                    animate={{ x: `calc(${value} - 16px)` }}
                    transition={{ delay: delay + 0.8, duration: 1, ease: "easeOut" }}
                  >
                    <Train className="w-2 h-2 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Railway particles effect */}
        {railwayTheme && (
          <>
            <motion.div
              className="absolute top-4 right-4 w-1 h-1 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default InfoCard;
