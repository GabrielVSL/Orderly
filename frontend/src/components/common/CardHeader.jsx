import React from 'react';

export const CardHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="p-6 sm:p-8 bg-white border-b border-neutral-100">
      <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-black uppercase tracking-tight mb-1 text-neutral-900">
        {Icon && <Icon className="w-8 h-8 text-patties-red" />}
        {title}
      </h1>
      <p className="text-neutral-500 font-medium text-sm sm:text-base">{description}</p>
    </div>
  );
};

export default CardHeader;
