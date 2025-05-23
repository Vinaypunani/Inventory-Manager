import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  fetchInventory,
  deleteInventoryItem,
  searchInventory,
} from '../store/slices/inventorySlice';
import Sidebar from '../components/Sidebar';
import { logout } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const InventoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, searchResults } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searching, setSearching] = useState(false);

  // Get unique categories from items
  const categories = [...new Set(items.map(item => item.category))].sort();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    await dispatch(searchInventory({ 
      query: search,
      category: selectedCategory 
    }));
    setSearching(false);
  };

  const handleClear = () => {
    setSearch('');
    setSelectedCategory('');
    dispatch(fetchInventory());
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const result = await dispatch(deleteInventoryItem(id));
      if (!result.error) {
        toast.success('Item deleted successfully!');
      } else {
        toast.error(result.payload?.message || 'Failed to delete item.');
      }
    }
  };

  const data = (search || selectedCategory) ? searchResults : items;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 ml-0 sm:ml-64 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory</h1>
            <Link
              to="/inventory/new"
              className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-150 text-center"
            >
              + Add Item
            </Link>
          </div>

          <form onSubmit={handleSearch} className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="w-full sm:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-150 flex items-center justify-center gap-2"
                  disabled={searching}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span className="sm:hidden">Search</span>
                  <span className="hidden sm:inline">{searching ? 'Searching...' : 'Search'}</span>
                </button>
                {(search || selectedCategory) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 sm:flex-none bg-gray-200 text-gray-800 px-4 sm:px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span className="sm:hidden">Clear</span>
                    <span className="hidden sm:inline">Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
            {(search || selectedCategory) && (
              <div className="text-sm text-gray-500">
                Showing results for {search && `"${search}"`} {search && selectedCategory && 'in'} {selectedCategory && `category: ${selectedCategory}`}
              </div>
            )}
          </form>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
              <ExclamationTriangleIcon className="h-12 w-12 text-blue-300 mb-4" />
              <div className="text-lg text-gray-500 mb-2 text-center">
                {search || selectedCategory 
                  ? 'No matching items found.' 
                  : 'No inventory items found.'}
              </div>
              {!search && !selectedCategory && (
                <Link
                  to="/inventory/new"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-150"
                >
                  + Add your first item
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6">Name</th>
                        <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Description</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Quantity</th>
                        <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Price</th>
                        <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Category</th>
                        <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Supplier</th>
                        <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Low Stock</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-blue-50 transition-colors duration-150"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.itemName}
                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                              {item.category} • ${item.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.description}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              {item.quantity}
                              {item.quantity <= item.lowStockAlert && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                                  Low
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.supplier}
                          </td>
                          <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.lowStockAlert}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/inventory/${item._id}/edit`}
                                className="inline-flex items-center gap-1 bg-yellow-400 text-white px-2 sm:px-3 py-1 rounded hover:bg-yellow-500 transition shadow-sm"
                              >
                                <PencilSquareIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="inline-flex items-center gap-1 bg-red-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-600 transition shadow-sm"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InventoryList; 