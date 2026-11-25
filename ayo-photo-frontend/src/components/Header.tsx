import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scrolls to a section on the target page. From any other page it navigates
  // there first; App.tsx's ScrollToTop then scrolls to the #hash once rendered.
  const scrollToSection = (sectionId: string, path: string = '/') => {
    if (location.pathname !== path) {
      navigate({ pathname: path, hash: `#${sectionId}` });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        // 72px leaves room for the fixed navbar
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const linkClass = (path: string) =>
    `transition-colors font-medium ${
      location.pathname === path ? 'text-amber-600' : 'text-gray-700 hover:text-gray-900'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-gray-800" />
            <span className="text-xl font-bold text-gray-800">Rhythmic Shot</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home', '/')}
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </button>
            {/* <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              About
            </Link> */}
            <Link to="/archive" className={linkClass('/archive')}>
              Rhythmic Archive
            </Link>
            <Link to="/services" className={linkClass('/services')}>
              Services
            </Link>
            <button
              onClick={() => scrollToSection('contact', '/')}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Book Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('home', '/')}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-left"
              >
                Home
              </button>
              {/* <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-left"
              >
                About
              </Link> */}
              <Link
                to="/archive"
                onClick={() => setIsMenuOpen(false)}
                className={`${linkClass('/archive')} text-left`}
              >
                Rhythmic Archive
              </Link>
              <Link
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className={`${linkClass('/services')} text-left`}
              >
                Services
              </Link>
              <button
                onClick={() => scrollToSection('contact', '/')}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium w-fit"
              >
                Book Now
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;