const Todo = require('../models/Todo');
const mongoose = require('mongoose');

// GET /api/todos - User: own tasks (assignedTo me); Admin: all with full details
exports.getTodos = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { assignedTo: req.user.id };
    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/todos - User: create for self; Admin: create and assign to any user
exports.createTodo = async (req, res) => {
  try {
    const { title, assignedTo } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const assigneeId = isAdmin && assignedTo ? assignedTo : userId;
    if (assigneeId && !mongoose.Types.ObjectId.isValid(assigneeId)) {
      return res.status(400).json({ error: 'Invalid assignedTo user' });
    }
    const todo = await Todo.create({
      title: title.trim(),
      createdBy: userId,
      assignedTo: assigneeId,
    });
    const populated = await Todo.findById(todo._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/todos/:id - User: only if assignedTo me; Admin: any
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updates = {};
    if (typeof title === 'string') updates.title = title.trim();
    if (typeof completed === 'boolean') updates.completed = completed;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/todos/:id - Admin only (user has no delete permission)
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted', id: todo._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/todos - Delete all completed (Admin only)
exports.deleteCompleted = async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({ message: `${result.deletedCount} todo(s) deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
