import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { logout } from '../store/slices/authSlice';
import {
  HomeIcon,
  CubeIcon,
  PlusCircleIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md rounded-b-2xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105">
              <CubeIcon className="h-8 w-8 text-blue-600 transition-transform duration-200 group-hover:scale-110" />
              <span className="ml-2 text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-blue-700 transition-colors duration-200">Inventory Manager</span>
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/inventory"
                className="flex items-center gap-1 text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <CubeIcon className="h-5 w-5" />
                Inventory
              </Link>
              <Link
                to="/inventory/new"
                className="flex items-center gap-1 text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add Item
              </Link>
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-gray-600 hover:text-blue-700 focus:outline-none">
                  <UserCircleIcon className="h-8 w-8 transition-transform duration-200 hover:scale-110" />
                  <span className="ml-2 text-sm font-semibold">{user?.username}</span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`$${
                            active ? 'bg-blue-50 text-blue-700' : ''
                          } flex w-full items-center px-4 py-2 text-sm text-gray-700 rounded-md transition-colors duration-200`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 