const Inventory = require('../models/inventory.model');

// Get all inventory items for the current user
exports.getAll = async (req, res) => {
    try {
        const items = await Inventory.find({ userId: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search inventory items
exports.search = async (req, res) => {
    try {
        const { query, category, sortBy, sortOrder } = req.query;
        let searchQuery = { userId: req.user._id };
        if (query) {
            searchQuery.$or = [
                { itemName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) {
            searchQuery.category = category;
        }
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }
        const items = await Inventory.find(searchQuery).sort(sortOptions);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get low stock items
exports.getLowStock = async (req, res) => {
    try {
        const items = await Inventory.find({
            userId: req.user._id,
            $expr: { $lte: ['$quantity', '$lowStockAlert'] }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single inventory item
exports.getOne = async (req, res) => {
    try {
        const item = await Inventory.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new inventory item
exports.create = async (req, res) => {
    try {
        const item = new Inventory({
            ...req.body,
            userId: req.user._id
        });
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an inventory item
exports.update = async (req, res) => {
    try {
        const item = await Inventory.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an inventory item
exports.remove = async (req, res) => {
    try {
        const item = await Inventory.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 