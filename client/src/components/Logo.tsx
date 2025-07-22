import React from "react";

const Logo = ({ size = "large" }: { size?: "large" | "small" }) => (
  <div className={`font-extrabold text-primary ${size === "large" ? "text-4xl" : "text-xl"}`}>
    Resume<span className="text-indigo-600">Builder</span>
  </div>
);

export default Logo; 