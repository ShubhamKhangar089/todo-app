const User = require('../models/User');

// GET /api/users - List all users (Admin only, for assigning tasks)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
