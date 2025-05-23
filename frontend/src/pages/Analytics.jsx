import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { fetchInventory } from '../store/slices/inventorySlice';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);

  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  // Calculate metrics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStockItems = items.filter(item => item.quantity <= item.lowStockAlert).length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;

  // Prepare category data for charts
  const categoryData = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {});

  // Prepare value by category data
  const valueByCategory = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.price * item.quantity);
    return acc;
  }, {});

  // Chart data
  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Items by Category',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(16, 185, 129, 0.8)',  // green
          'rgba(245, 158, 11, 0.8)',  // yellow
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(139, 92, 246, 0.8)',  // purple
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const valueChartData = {
    labels: Object.keys(valueByCategory),
    datasets: [
      {
        label: 'Value by Category ($)',
        data: Object.values(valueByCategory),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 ml-0 sm:ml-64 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-2 text-gray-600">Track your inventory performance and insights</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading analytics...</div>
          ) : (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CubeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${totalValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-2xl font-semibold text-gray-900">{lowStockItems}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <ChartBarIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                      <p className="text-2xl font-semibold text-gray-900">{outOfStockItems}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Items by Category</h2>
                  <div className="h-80">
                    <Doughnut data={categoryChartData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Value by Category</h2>
                  <div className="h-80">
                    <Bar data={valueChartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg mt-1">
                      <ChartBarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Category Distribution</p>
                      <p className="text-gray-600 text-sm">
                        Your inventory is distributed across {Object.keys(categoryData).length} categories.
                        {Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0] && (
                          <span> {Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0][0]} has the highest quantity.</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg mt-1">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Stock Alerts</p>
                      <p className="text-gray-600 text-sm">
                        {lowStockItems} items are running low on stock, and {outOfStockItems} items are out of stock.
                        {lowStockItems > 0 && ' Consider replenishing these items soon.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg mt-1">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Inventory Value</p>
                      <p className="text-gray-600 text-sm">
                        Your total inventory is valued at ${totalValue.toLocaleString()}.
                        {Object.entries(valueByCategory).sort((a, b) => b[1] - a[1])[0] && (
                          <span> {Object.entries(valueByCategory).sort((a, b) => b[1] - a[1])[0][0]} category holds the highest value.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 