import React from 'react';

export const PageLayout = ({ children, center = false }) => {
  const baseStyle = "min-h-[calc(100vh-80px)] bg-gradient-to-br from-brand-light via-purple-50 to-pink-50 px-4";
  const centerStyle = center ? "flex items-center justify-center" : "py-12";

  return (
    <div className={`${baseStyle} ${centerStyle}`}>
      {children}
    </div>
  );
};