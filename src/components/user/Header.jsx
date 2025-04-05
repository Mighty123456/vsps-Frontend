import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaVideo, FaUser, FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status when component mounts or location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const navigationItems = [
    {
      label: 'Home',
      path: '/'
    },
    {
      label: 'Events',
      dropdown: [
        { label: 'Event Categories', path: '/events/categories' },
        { label: 'Book Event', path: '/booking' }
      ]
    },
    {
      label: 'Live',
      dropdown: [
        { label: 'Live Events', path: '/live-streaming' },
        { label: 'Upcoming Broadcasts', path: '/live-streaming' }
      ]
    },
    {
      label: 'Gallery',
      path: '/gallery'
    },
    {
      label: 'Services',
      dropdown: [
        { label: 'Our Services', path: '/services' },
        { label: 'Amenities', path: '/services/amenities' }
      ]
    },
    {
      label: 'Reviews',
      dropdown: [
        { label: 'Testimonials', path: '/testimonials' },
        { label: 'Submit Review', path: '/reviews/submit-review' }
      ]
    },
    {
      label: 'Resources',
      path: '/resources'
    },
    {
      label: 'Contact',
      path: '/contact'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsProfileDropdownOpen(false);
    navigate('/auth');
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <FaVideo className="text-2xl" /> */}
            <span className="text-2xl font-bold">VSPS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <div>
                    <button
                      className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1
                        ${activeDropdown === index ? 'bg-white/10' : 'hover:bg-white/10'}`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown */}
                    <div
                      className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 
                        ${activeDropdown === index ? 'opacity-100 visible' : 'opacity-0 invisible'} 
                        transition-all duration-200 transform origin-top-right z-50`}
                    >
                      <div className="py-1">
                        {item.dropdown.map((dropdownItem, dropdownIndex) => (
                          <Link
                            key={dropdownIndex}
                            to={dropdownItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-3 py-2 rounded-md transition-colors
                      ${isActive(item.path) ? 'bg-white/10' : 'hover:bg-white/10'}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Profile Dropdown */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="ml-4 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <FaUser />
                  <span>Profile</span>
                </button>
                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile-settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/recently-booked"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Recent Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-4 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <FaUser />
                <span>Sign In</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            {navigationItems.map((item, index) => (
              <div key={index} className="px-2">
                {item.dropdown ? (
                  <div className="py-2">
                    <div className="font-medium mb-2">{item.label}</div>
                    <div className="ml-4 space-y-1">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          to={dropdownItem.path}
                          className="block py-1 text-sm text-white/80 hover:text-white"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="block py-2 hover:bg-white/10 rounded-md px-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            {/* Mobile Login/Signup */}
            <div className="px-2 pt-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    to="/profile-settings"
                    className="block text-center px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/recently-booked"
                    className="block text-center px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Recent Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block text-center px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;