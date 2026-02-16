const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, requireAdmin } = require('../middlewares/auth');

router.get('/', protect, requireAdmin, userController.getUsers);

module.exports = router;
