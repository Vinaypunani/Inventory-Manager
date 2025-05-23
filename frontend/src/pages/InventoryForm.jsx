import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  createInventoryItem,
  updateInventoryItem,
  fetchInventoryItem,
  clearCurrentItem,
} from '../store/slices/inventorySlice';
import Sidebar from '../components/Sidebar';
import { logout } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const InventoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { currentItem, loading, error } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);

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

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchInventoryItem(id));
    } else {
      dispatch(clearCurrentItem());
    }
    // Cleanup on unmount
    return () => dispatch(clearCurrentItem());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentItem) {
      setForm({
        itemName: currentItem.itemName || '',
        description: currentItem.description || '',
        quantity: currentItem.quantity || '',
        price: currentItem.price || '',
        category: currentItem.category || '',
        supplier: currentItem.supplier || '',
        lowStockAlert: currentItem.lowStockAlert || 5,
      });
    }
  }, [currentItem, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.itemName || !form.quantity || !form.price || !form.category || !form.supplier) {
      setFormError('Please fill in all required fields.');
      toast.error('Please fill in all required fields.');
      return;
    }
    if (isEdit) {
      const result = await dispatch(updateInventoryItem({
        id,
        itemData: {
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
          lowStockAlert: Number(form.lowStockAlert),
        },
      }));
      if (!result.error) {
        toast.success('Item updated successfully!');
        navigate('/inventory');
      } else {
        setFormError(result.payload?.message || 'Failed to update item.');
        toast.error(result.payload?.message || 'Failed to update item.');
      }
    } else {
      const result = await dispatch(createInventoryItem({
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        lowStockAlert: Number(form.lowStockAlert),
      }));
      if (!result.error) {
        toast.success('Item added successfully!');
        navigate('/inventory');
      } else {
        setFormError(result.payload?.message || 'Failed to add item.');
        toast.error(result.payload?.message || 'Failed to add item.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 ml-0 sm:ml-64 p-6 flex items-center justify-center">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
            <div className="flex items-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Back to inventory"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Add'} Inventory Item</h1>
            </div>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm animate-fade-in mb-2" role="alert">
                {formError}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm animate-fade-in mb-2" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                  required
                  placeholder="e.g. Widget Pro"
                />
                <span className="text-xs text-gray-400 mt-1">Required</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                  placeholder="Short description (optional)"
                />
                <span className="text-xs text-gray-400 mt-1">Optional</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="0"
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                    required
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-400 mt-1">Required</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                    required
                    placeholder="0.00"
                  />
                  <span className="text-xs text-gray-400 mt-1">Required</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                    required
                    placeholder="e.g. Electronics"
                  />
                  <span className="text-xs text-gray-400 mt-1">Required</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="supplier"
                    value={form.supplier}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                    required
                    placeholder="e.g. Acme Corp"
                  />
                  <span className="text-xs text-gray-400 mt-1">Required</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                <input
                  type="number"
                  name="lowStockAlert"
                  value={form.lowStockAlert}
                  onChange={handleChange}
                  min="0"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                  placeholder="5"
                />
                <span className="text-xs text-gray-400 mt-1">Optional. Get notified when stock falls below this number.</span>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 transition-all duration-150 active:scale-95 mt-2"
                disabled={loading}
              >
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InventoryForm; 