import React from 'react';
import { motion } from 'framer-motion';

const ProgressChart = ({
  title,
  data,
  type = 'bar', // 'bar', 'pie', 'line'
  height = 200,
  delay = 0
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
          <div className="w-24 text-sm font-medium text-gray-700 truncate">
            {item.label}
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{
                  delay: delay + index * 0.1,
                  duration: 1,
                  ease: "easeOut"
                }}
              />
            </div>
          </div>
          <div className="w-12 text-right text-sm font-semibold text-gray-900">
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
              />
            );
          })}
        </svg>

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
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
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
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <motion.line
              key={index}
              x1="0"
              y1={height - 20 - ratio * (height - 40)}
              x2="100%"
              y2={height - 20 - ratio * (height - 40)}
              stroke="#e5e7eb"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: delay + index * 0.1, duration: 0.5 }}
            />
          ))}

          {/* Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeInOut" }}
          />

          {/* Points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * (height - 40) + 20;
            const y = height - 20 - (item.value / maxValue) * (height - 40);

            return (
              <motion.circle
                key={item.label}
                cx={x}
                cy={y}
                r="4"
                fill="white"
                stroke="url(#gradient)"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: delay + 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ r: 6 }}
              />
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
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
              <div className="text-xs text-gray-600">{item.label}</div>
              <div className="text-sm font-semibold text-gray-900">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        className="text-lg font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.2 }}
      >
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
