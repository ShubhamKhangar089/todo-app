const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { protect, requireAdmin, requireTodoAccess } = require('../middlewares/auth');

// All todo routes require login
router.use(protect);

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.patch('/:id', requireTodoAccess('update'), todoController.updateTodo);
// Only admin can delete any task (user has no delete permission)
router.delete('/:id', requireAdmin, todoController.deleteTodo);
router.delete('/', requireAdmin, todoController.deleteCompleted);

module.exports = router;
