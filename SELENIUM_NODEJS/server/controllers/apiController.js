// controllers/apiController.js

// Example function to get all items
exports.getAllItems = (req, res) => {
  // Mock data, replace with actual database queries
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  res.json(items);
};

// Example function to create a new item
exports.createItem = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  // Mock data, replace with actual database logic
  const newItem = { id: Date.now(), name };
  res.status(201).json(newItem);
};

// Example function to get a single item by ID
exports.getItemById = (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  // Mock data, replace with actual database queries
  const item = { id: itemId, name: `Item ${itemId}` };

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.json(item);
};

// Example function to update an item by ID
exports.updateItem = (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  // Mock data, replace with actual update logic
  const updatedItem = { id: itemId, name };
  res.json(updatedItem);
};

// Example function to delete an item by ID
exports.deleteItem = (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  // Mock data, replace with actual deletion logic
  res.status(204).end(); // No content
};
