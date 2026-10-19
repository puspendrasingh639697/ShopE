import React from 'react';

const StatsCard = ({ title, value, icon, color = '#8c0a15', prefix = '' }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-xl transition" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            {title}
          </p>
          <p className="text-3xl font-bold text-[#4a2e18] mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
        </div>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;