import React from 'react';
import { motion } from 'framer-motion';
import { Train, Zap, TrendingUp } from 'lucide-react';

const ProgressChart = ({
  title,
  data,
  type = 'bar', // 'bar', 'pie', 'line'
  height = 200,
  delay = 0,
  railwayTheme = true
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const renderBarChart = () => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          className="flex items-center space-x-4"
          variants={itemVariants}
        >
          <div className="w-24 text-sm font-medium text-gray-700 truncate flex items-center">
            {railwayTheme && <Train className="w-3 h-3 mr-1 text-green-600" />}
            {item.label}
          </div>
          <div className="flex-1 relative">
            <div className="w-full bg-gray-200 rounded-full h-4 railway-track">
              <motion.div
                className="h-4 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-green-600 railway-progress"
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{
                  delay: delay + index * 0.1,
                  duration: 1,
                  ease: "easeOut"
                }}
              />
              {/* Moving train effect */}
              {railwayTheme && (
                <motion.div
                  className="absolute top-0 left-0 w-6 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ x: `calc(${item.percentage}% - 24px)` }}
                  transition={{
                    delay: delay + index * 0.1,
                    duration: 1,
                    ease: "easeOut"
                  }}
                >
                  <Train className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
            {/* Signal lights */}
            {railwayTheme && (
              <>
                <motion.div
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full signal-approved"
                  animate={{
                    boxShadow: [
                      '0 0 5px rgba(34, 197, 94, 0.5)',
                      '0 0 15px rgba(34, 197, 94, 0.8)',
                      '0 0 5px rgba(34, 197, 94, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                />
                <motion.div
                  className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full signal-pending"
                  animate={{
                    boxShadow: [
                      '0 0 5px rgba(59, 130, 246, 0.5)',
                      '0 0 15px rgba(59, 130, 246, 0.8)',
                      '0 0 5px rgba(59, 130, 246, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2 + 0.5
                  }}
                />
              </>
            )}
          </div>
          <div className="w-12 text-right text-sm font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
            {item.value}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top

    return (
      <div className="relative" style={{ height: height }}>
        <svg
          width={height}
          height={height}
          viewBox={`0 0 ${height} ${height}`}
          className="mx-auto"
        >
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const centerX = height / 2;
            const centerY = height / 2;
            const radius = height / 2 - 20;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle = endAngle;

            return (
              <motion.path
                key={item.label}
                d={pathData}
                fill={item.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: delay + index * 0.2,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                className="railway-segment"
              />
            );
          })}
        </svg>

        {/* Railway signal in center */}
        {railwayTheme && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full signal-approved shadow-lg"
            animate={{
              boxShadow: [
                '0 0 10px rgba(34, 197, 94, 0.5)',
                '0 0 25px rgba(34, 197, 94, 0.9)',
                '0 0 10px rgba(34, 197, 94, 0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Legend */}
        <div className="absolute top-4 right-4 space-y-2">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.5 + index * 0.1 }}
            >
              <div
                className="w-3 h-3 rounded-full railway-signal"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 flex items-center">
                {railwayTheme && <Train className="w-3 h-3 mr-1 text-green-600" />}
                {item.label}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (height - 40) + 20;
      const y = height - 20 - (item.value / maxValue) * (height - 40);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative" style={{ height: height }}>
        <svg width="100%" height={height} className="overflow-visible">
          {/* Railway track grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <motion.line
              key={index}
              x1="0"
              y1={height - 20 - ratio * (height - 40)}
              x2="100%"
              y2={height - 20 - ratio * (height - 40)}
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="railway-track-line"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: delay + index * 0.1, duration: 0.5 }}
            />
          ))}

          {/* Railway line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke="url(#railwayGradient)"
            strokeWidth="4"
            className="railway-line"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeInOut" }}
          />

          {/* Points with railway signals */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * (height - 40) + 20;
            const y = height - 20 - (item.value / maxValue) * (height - 40);

            return (
              <g key={item.label}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="white"
                  stroke="url(#railwayGradient)"
                  strokeWidth="3"
                  className="railway-station"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: delay + 0.8 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ r: 8 }}
                />
                {/* Signal light */}
                {railwayTheme && (
                  <motion.circle
                    cx={x}
                    cy={y - 12}
                    r="3"
                    fill="#22c55e"
                    className="signal-approved"
                    animate={{
                      fill: ['#22c55e', '#16a34a', '#22c55e']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="railwayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 1 + index * 0.1 }}
            >
              <div className="text-xs text-gray-600 flex items-center justify-center">
                {railwayTheme && <Train className="w-3 h-3 mr-1 text-green-600" />}
                {item.label}
              </div>
              <div className="text-sm font-semibold text-gray-900">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl railway-chart"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Railway track separator */}
      {railwayTheme && (
        <div className="track-separator absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60"></div>
      )}

      <motion.h3
        className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.2 }}
      >
        {railwayTheme && <Zap className="w-5 h-5 mr-2 text-green-600" />}
        {title}
      </motion.h3>

      <div style={{ height: height }}>
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'line' && renderLineChart()}
      </div>
    </motion.div>
  );
};

export default ProgressChart;
