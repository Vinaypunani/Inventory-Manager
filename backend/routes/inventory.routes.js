const router = require('express').Router();
const verifyToken = require('../middleware/auth.middleware');
const inventoryController = require('../controllers/inventory.controller');

// Get all inventory items for the current user
router.get('/', verifyToken, inventoryController.getAll);

// Search inventory items
router.get('/search', verifyToken, inventoryController.search);

// Get low stock items
router.get('/low-stock', verifyToken, inventoryController.getLowStock);

// Get a single inventory item
router.get('/:id', verifyToken, inventoryController.getOne);

// Create a new inventory item
router.post('/', verifyToken, inventoryController.create);

// Update an inventory item
router.put('/:id', verifyToken, inventoryController.update);

// Delete an inventory item
router.delete('/:id', verifyToken, inventoryController.remove);

module.exports = router; 