import React from 'react';

export const CardHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="p-6 sm:p-8 bg-gradient-to-r from-yellow-50 to-red-50 border-b-2 border-yellow-200">
      <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-black mb-1.5 text-brand-dark">
        {Icon && <Icon className="w-8 h-8 text-brand-red" />}
        {title}
      </h1>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </div>
  );
};

export default CardHeader;
