import React from 'react';
import { FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-t-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Job Hunt</h2>
            <p className="text-sm">© 2026 Your Company. All rights reserved.</p>
          </div>

          <div className="flex space-x-5">
            <a href="https://www.linkedin.com/in/faiyaj-ansari-293413366" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-[#0A66C2] text-3xl hover:scale-110 transition" />
            </a>

            <a href="https://github.com/your-github-username" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-black text-3xl hover:scale-110 transition" />
            </a>

            <a href="https://www.youtube.com/@TechWaleBhaiya-l4i" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-[#FF0000] text-3xl hover:scale-110 transition" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
