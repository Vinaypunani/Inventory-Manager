import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Async thunks
export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/inventory`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchInventoryItem = createAsyncThunk(
  'inventory/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/inventory/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createInventoryItem = createAsyncThunk(
  'inventory/create',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/inventory`, itemData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/update',
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/inventory/${id}`, itemData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'inventory/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/inventory/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchInventory = createAsyncThunk(
  'inventory/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/inventory/search`, {
        params: searchParams,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLowStockItems = createAsyncThunk(
  'inventory/lowStock',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/inventory/low-stock`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  searchResults: [],
  lowStockItems: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all items
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch inventory';
      })
      // Fetch single item
      .addCase(fetchInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch item';
      })
      // Create item
      .addCase(createInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create item';
      })
      // Update item
      .addCase(updateInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        );
        state.currentItem = action.payload;
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update item';
      })
      // Delete item
      .addCase(deleteInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.currentItem = null;
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete item';
      })
      // Search items
      .addCase(searchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Search failed';
      })
      // Low stock items
      .addCase(fetchLowStockItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowStockItems.fulfilled, (state, action) => {
        state.loading = false;
        state.lowStockItems = action.payload;
      })
      .addCase(fetchLowStockItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch low stock items';
      });
  },
});

export const { clearError, clearCurrentItem } = inventorySlice.actions;
export default inventorySlice.reducer; 