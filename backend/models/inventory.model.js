const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    supplier: {
        type: String,
        required: true,
        trim: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    lowStockAlert: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

// Index for faster queries
inventorySchema.index({ userId: 1, itemName: 1 }, { unique: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory; 