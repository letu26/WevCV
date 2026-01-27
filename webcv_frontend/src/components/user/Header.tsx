import React from 'react';
import { NavLink } from 'react-router';

const Header: React.FC = () => {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm font-medium transition-colors
   ${isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"}`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <NavLink
            to="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            MyApp
          </NavLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navItemClass}>
              Home
              <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-indigo-600 scale-x-0 transition-transform group-hover:scale-x-100" />
            </NavLink>

            <NavLink to="/about" className={navItemClass}>
              About
            </NavLink>

            <NavLink to="/contact" className={navItemClass}>
              Contact
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `hidden sm:inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Sign in
            </NavLink>

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow transition
                ${
                  isActive
                    ? "bg-indigo-700 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`
              }
            >
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;