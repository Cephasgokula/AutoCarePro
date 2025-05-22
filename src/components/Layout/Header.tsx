import React, { useState } from 'react';
import { Menu, X, Car, Calendar, History, User, LogOut, Settings, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { currentUser } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8" />
            <span className="text-2xl font-bold">AutoCare Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/services" className="hover:text-blue-200 transition-colors">
              Services
            </Link>
            <Link to="/bookings" className="hover:text-blue-200 transition-colors">
              My Bookings
            </Link>
            <Link to="/vehicles" className="hover:text-blue-200 transition-colors">
              My Vehicles
            </Link>
            {currentUser.role === 'admin' && (
              <Link to="/admin" className="hover:text-blue-200 transition-colors">
                Admin Dashboard
              </Link>
            )}
            {currentUser.role === 'technician' && (
              <Link to="/technician" className="hover:text-blue-200 transition-colors">
                Work Orders
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                  <span className="font-medium">{currentUser.name.charAt(0)}</span>
                </div>
                <span>{currentUser.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-3">
              <Link to="/services" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                <Wrench className="h-5 w-5" />
                <span>Services</span>
              </Link>
              <Link to="/bookings" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                <Calendar className="h-5 w-5" />
                <span>My Bookings</span>
              </Link>
              <Link to="/vehicles" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                <Car className="h-5 w-5" />
                <span>My Vehicles</span>
              </Link>
              <Link to="/history" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                <History className="h-5 w-5" />
                <span>Service History</span>
              </Link>
              {currentUser.role === 'admin' && (
                <Link to="/admin" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <Settings className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              {currentUser.role === 'technician' && (
                <Link to="/technician" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <Wrench className="h-5 w-5" />
                  <span>Work Orders</span>
                </Link>
              )}
              <div className="border-t border-blue-600 my-2"></div>
              <Link to="/profile" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link to="/logout" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;