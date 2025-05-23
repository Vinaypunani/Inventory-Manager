import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CubeIcon,
  HomeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Inventory', to: '/inventory', icon: CubeIcon },
  { name: 'Add Item', to: '/inventory/new', icon: PlusCircleIcon },
  { name: 'Analytics', to: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
];

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Sidebar content for reuse
  const sidebarContent = (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -60, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-64 bg-white shadow-xl rounded-r-3xl flex flex-col py-8 px-4 gap-6 h-full"
    >
      <div className="flex items-center gap-2 mb-8 px-2">
        <CubeIcon className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Inventory Manager</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 group
              ${location.pathname === link.to ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
            onClick={() => setOpen(false)}
          >
            <link.icon className={`h-6 w-6 ${location.pathname === link.to ? 'text-blue-600' : 'text-blue-400 group-hover:text-blue-600'} transition-colors duration-200`} />
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
          <UserCircleIcon className="h-7 w-7 text-gray-400" />
          <div>
            <div className="font-semibold text-gray-900">{user?.username}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </motion.aside>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-40 bg-white rounded-full shadow p-2 focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6 text-blue-600" />
      </button>
      {/* Desktop sidebar - always fixed to the left */}
      <div className="hidden sm:block fixed left-0 top-0 h-full z-30">
        {sidebarContent}
      </div>
      {/* Mobile sidebar overlay - slides in from the left */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setOpen(false)} />
            <div className="relative z-10 h-full">
              {sidebarContent}
              <button
                className="absolute top-4 right-4 bg-white rounded-full shadow p-1 focus:outline-none"
                onClick={() => setOpen(false)}
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar; 