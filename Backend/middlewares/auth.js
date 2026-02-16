const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Todo = require('../models/Todo');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-change-in-production';

// Attach user to req if valid JWT
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Not authorized. Please login.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    next(err);
  }
};

// Require admin role
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

// User can only act on tasks assigned to them; admin can act on any task
exports.requireTodoAccess = (action) => async (req, res, next) => {
  try {
    if (req.user.role === 'admin') return next();
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    const assignedToId = todo.assignedTo?.toString();
    if (assignedToId !== req.user.id) {
      return res.status(403).json({ error: 'You can only ' + action + ' tasks assigned to you.' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
