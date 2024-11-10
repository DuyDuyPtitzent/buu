const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Lấy tất cả nhiệm vụ
router.get('/', todoController.getAlltodoRoutes);

// Tạo nhiệm vụ mới
router.post('/', todoController.createTodo);

// Cập nhật nhiệm vụ theo ID
router.put('/:id', todoController.updateTodo);

// Xóa nhiệm vụ theo ID
router.delete('/:id', todoController.deleteTodo); 

module.exports = router;
