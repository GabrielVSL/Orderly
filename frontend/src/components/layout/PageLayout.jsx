import React from 'react';

export const PageLayout = ({ children, center = false, className = '' }) => {
  const baseStyle = "min-h-[calc(100vh-80px)] bg-[#F8F5EE] px-4";
  const centerStyle = center ? "flex items-center justify-center py-12" : "py-10";

  return (
    <div className={`${baseStyle} ${centerStyle} ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;
