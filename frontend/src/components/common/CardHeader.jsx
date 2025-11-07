import React from 'react';

export const CardHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="p-8 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-200/50">
      <h1 className="flex items-center gap-3 text-3xl font-bold mb-2 text-gray-900">
        {Icon && <Icon className="w-8 h-8 text-brand-purple" />}
        {title}
      </h1>
      <p className="text-brand-gray">{description}</p>
    </div>
  );
};

export default CardHeader;