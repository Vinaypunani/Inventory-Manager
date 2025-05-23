import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchInventory, fetchLowStockItems, createInventoryItem } from '../store/slices/inventorySlice';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { logout } from '../store/slices/authSlice';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, lowStockItems, loading, error } = useSelector((state) => state.inventory);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    itemName: '',
    description: '',
    quantity: '',
    price: '',
    category: '',
    supplier: '',
    lowStockAlert: 5,
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchLowStockItems());
  }, [dispatch]);

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lowStockCount = lowStockItems.length;

  const stats = [
    {
      name: 'Total Items',
      value: totalItems,
      icon: CubeIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: ArrowTrendingUpIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Low Stock Items',
      value: lowStockCount,
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.itemName || !form.quantity || !form.price || !form.category || !form.supplier) {
      setFormError('Please fill in all required fields.');
      return;
    }
    const result = await dispatch(createInventoryItem({
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
      lowStockAlert: Number(form.lowStockAlert),
    }));
    if (!result.error) {
      setShowModal(false);
      setForm({
        itemName: '',
        description: '',
        quantity: '',
        price: '',
        category: '',
        supplier: '',
        lowStockAlert: 5,
      });
    } else {
      setFormError(result.payload?.message || 'Failed to add item.');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 ml-0 sm:ml-64 p-6">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.username}!</h1>
              <p className="mt-1 text-sm text-gray-500">
                Here's an overview of your inventory at {user?.shopName}
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
              onClick={() => setShowModal(true)}
            >
              + Add Item
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Add Inventory Item</h2>
                {formError && (
                  <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">{formError}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Name *</label>
                    <input
                      type="text"
                      name="itemName"
                      value={form.itemName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Category *</label>
                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Supplier *</label>
                      <input
                        type="text"
                        name="supplier"
                        value={form.supplier}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Low Stock Alert</label>
                    <input
                      type="number"
                      name="lowStockAlert"
                      value={form.lowStockAlert}
                      onChange={handleChange}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Item'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
              >
                <dt>
                  <div className={`absolute rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                </dt>
                <dd className="ml-16 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </dd>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Low Stock Items</h2>
              <Link
                to="/inventory"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                {loading ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : lowStockItems.length === 0 ? (
                  <div className="text-center text-gray-500">No low stock items</div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {lowStockItems.map((item) => (
                        <li key={item._id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <CubeIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {item.itemName}
                              </p>
                              <p className="truncate text-sm text-gray-500">
                                {item.quantity} units remaining
                              </p>
                            </div>
                            <div>
                              <Link
                                to={`/inventory/${item._id}/edit`}
                                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                Update
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 