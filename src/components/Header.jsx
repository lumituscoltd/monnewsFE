import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="MonNews Lummitus Logo" 
              className="w-20 h-20 object-contain"
            />
            <h1 className="logo-text text-3xl font-bold text-primary">
              MonNews Lummitus
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors"
            >
              Tìm kiếm
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-not-allowed opacity-60"
              onClick={(e) => e.preventDefault()}
            >
              Phân tích công nghệ
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-not-allowed opacity-60"
              onClick={(e) => e.preventDefault()}
            >
              Hội thảo
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

