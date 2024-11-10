const db = require('../configs/database');

const Todo = {
    getAll: (callback) => {
        db.query('SELECT * FROM todoRoutes', (err, results) => {
            if (err) {
                console.error('Error fetching tasks:', err);
                return callback(err, null);
            }
            console.log('Data from DB:', results); // Thêm dòng này để kiểm tra dữ liệu lấy từ DB
            callback(null, results);
        });
    }
    ,
    

    create: (title, dueDate, callback) => {
        if (!title || !dueDate) {
            return callback(new Error("Title and due date are required."), null);
        }

        db.query(
            'INSERT INTO todoRoutes (title, dueDate, completed) VALUES (?, ?, ?)', 
            [title, dueDate, false],
            (err, result) => {
                if (err) {
                    console.error('Error creating task:', err);
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    update: (id, title, completed, dueDate, callback) => {
        if (!id || !title || !dueDate) {
            return callback(new Error("ID, title, and due date are required."), null);
        }
    
        // Kiểm tra xem ID có tồn tại trong cơ sở dữ liệu không trước khi cập nhật
        db.query('SELECT * FROM todoRoutes WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error('Error checking task existence:', err);
                return callback(err, null);
            }
            if (result.length === 0) {
                console.warn(`No task found with ID: ${id}`);
                return callback(new Error("Task not found."), null);  // Nếu không tìm thấy nhiệm vụ
            }
    
            // Nếu tìm thấy task, tiến hành cập nhật
            db.query(
                'UPDATE todoRoutes SET title = ?, dueDate = ?, completed = ? WHERE id = ?',
                [title, dueDate, completed, id],
                (err, result) => {
                    if (err) {
                        console.error('Error updating task:', err);
                        return callback(err, null);
                    }
                    callback(null, result);
                }
            );
        });
    },

    delete: (id, callback) => {
        if (!id) {
            return callback(new Error("ID is required for deletion."), null);
        }

        // Kiểm tra xem task có tồn tại không trước khi xóa
        db.query('SELECT * FROM todoRoutes WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error('Error checking task existence:', err);
                return callback(err, null);
            }
            if (result.length === 0) {
                console.warn(`No task found with ID: ${id}`);
                return callback(new Error("Task not found."), null);  // Nếu không tìm thấy task
            }

            // Nếu tìm thấy task, tiến hành xóa
            db.query('DELETE FROM todoRoutes WHERE id = ?', [id], (err, result) => {
                if (err) {
                    console.error('Error deleting task:', err);
                    return callback(err, null);
                }
                callback(null, result);
            });
        });
    }
};

module.exports = Todo;
