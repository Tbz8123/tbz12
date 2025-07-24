import React from "react";

const Logo = ({ size = "large" }: { size?: "large" | "medium" | "small" }) => {
  const sizeClasses = {
    large: "text-4xl",
    medium: "text-2xl",
    small: "text-xl"
  };
  
  return (
    <div className={`font-extrabold text-primary ${sizeClasses[size]}`}>
      Resume<span className="text-indigo-600">Builder</span>
    </div>
  );
};

export default Logo;