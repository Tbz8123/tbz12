
import React from "react";

const ProFooter = () => {
  return (
    <footer className="py-4 border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center text-xs text-gray-500 gap-4">
          <a href="#" className="hover:text-primary">TERMS AND CONDITIONS</a>
          <span>|</span>
          <a href="#" className="hover:text-primary">PRIVACY POLICY</a>
          <span>|</span>
          <a href="#" className="hover:text-primary">ACCESSIBILITY</a>
          <span>|</span>
          <a href="#" className="hover:text-primary">CONTACT US</a>
        </div>
        <div className="text-center mt-2 text-xs text-gray-400">
          © 2025, TbzResume Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default ProFooter;
