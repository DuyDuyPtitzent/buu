const Todo = require('../models/todo');

// Lấy tất cả nhiệm vụ
exports.getAlltodoRoutes = (req, res) => {
    Todo.getAll((err, tasks) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(tasks);
    });
};

// Tạo mới nhiệm vụ
exports.createTodo = (req, res) => {
    const { title, dueDate } = req.body;

    if (!title || !dueDate) {
        return res.status(400).json({ error: 'Title and due date are required.' });
    }

    Todo.create(title, dueDate, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, title, dueDate });
    });
};

// Cập nhật nhiệm vụ
exports.updateTodo = (req, res) => {
    const { id } = req.params;
    const { title, dueDate, completed } = req.body;

    if (!title || !dueDate) {
        return res.status(400).json({ error: 'ID, title, and due date are required.' });
    }

    Todo.update(id, title, completed, dueDate, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found.' });
        }

        res.json({ message: 'Task updated successfully.' });
    });
};

// Xóa nhiệm vụ
exports.deleteTodo = (req, res) => {
    const { id } = req.params;

    Todo.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found.' });
        }

        res.json({ message: 'Task deleted successfully.' });
    });
};
