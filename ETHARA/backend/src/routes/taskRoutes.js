const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.patch('/:id/status', protect, updateTaskStatus);

router.route('/:id')
  .put(protect, admin, updateTask)
  .delete(protect, admin, deleteTask);

module.exports = router;
