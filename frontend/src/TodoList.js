import React, { useState, useEffect } from 'react'; // Thêm useEffect ở đây
import { Modal, Input, Button, DatePicker } from 'antd';
import './TodoList.css';
import dayjs from 'dayjs';
import axios from 'axios';

// Định nghĩa apiUrl ngay bên dưới import để đảm bảo có trong scope
const apiUrl = 'http://localhost:3000/api';
 
  
const TodoList = () => {
  const [tasks, setTasks] = useState([]); // Khởi tạo state với useState
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ id: null, title: '', dueDate: null });

  // Dùng useEffect bên trong function component để lấy dữ liệu từ API khi component được render
  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log("Data from API:", response.data);  // In dữ liệu ra console để kiểm tra
      const formattedTasks = response.data.map(task => ({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  fetchTasks();
}, []);

  

  const showAddTaskModal = () => {
    setNewTask({ id: null, title: '', dueDate: null });
    setIsModalVisible(true);
  };
  
  const handleCancel = () => setIsModalVisible(false);

  const handleSaveTask = () => {
    const formattedDate = newTask.dueDate ? newTask.dueDate.toISOString() : null;
  
  
    if (newTask.title) { // Đảm bảo kiểm tra `title` thay vì `task`
      const taskData = {
        title: newTask.title,  // Đảm bảo sử dụng `title`
        dueDate: formattedDate,
        completed: newTask.completed || false,  // Thêm completed vào đây
        className: "due-new",
      };
  
      if (newTask.id) {
        // Cập nhật task
        axios.put(`${apiUrl}/${newTask.id}`, { ...taskData, completed: false })
          .then(() => {
            setTasks(tasks.map(task => task.id === newTask.id ? { ...task, ...taskData } : task));
            setIsModalVisible(false);
          })
          .catch((error) => {
            console.error('Error updating task:', error.response ? error.response.data : error.message);
            alert("Không thể cập nhật nhiệm vụ!");
          });
      } else {
        // Thêm mới task
        axios.post(apiUrl, taskData)
          .then((response) => {
            const newTaskWithId = { ...taskData, id: response.data.id };  // Đảm bảo có 'title'
            setTasks([...tasks, newTaskWithId]);
            setIsModalVisible(false);
          })
          .catch((error) => {
            console.error('Error adding task:', error.response ? error.response.data : error.message);
            alert("Không thể thêm nhiệm vụ!");
          });
      }
    } else {
      alert("Vui lòng nhập tiêu đề cho nhiệm vụ!");
    }
};
const handleCheckboxChange = (taskId, completed) => {
  axios.put(`${apiUrl}/${taskId}`, { 
    completed: completed, 
    title: 'Đã hoàn thành',  // Bạn có thể lấy tiêu đề này từ state của task.
    dueDate: '2024-11-10' // Cập nhật ngày hết hạn nếu cần.
  })
    .then(() => {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      ));
    })
    .catch(error => {
      console.error("Error updating task status:", error.response ? error.response.data : error.message);
      alert("Không thể cập nhật trạng thái hoàn thành!");
    });
};

  const handleDelete = (id) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.log('Delete error:', error);
        alert("Không thể xóa nhiệm vụ!");
      });
  };

  const handleEdit = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setNewTask({
        id: taskToEdit.id,
        title: taskToEdit.title,  // Đảm bảo lấy đúng trường 'title'
        dueDate: dayjs(taskToEdit.dueDate),
      });
      setIsModalVisible(true);
    }
  };
  return (
    <div className="todo-list-container">
      <h2 className="todo-list-header">My work🎯</h2>
      <ul className="todo-list">
  {tasks.map((task) => (
    <li key={task.id} className="todo-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
      />
      
      {/* Thêm kiểu strikethrough khi công việc đã hoàn thành */}
      <div className={`task-title ${task.completed ? 'completed' : ''}`}>
        {task.title}
      </div>

      <div className={`due-date ${task.className}`}>
        {task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : 'No Due Date'}
      </div>

      <button onClick={() => handleDelete(task.id)} className="delete-task-button">Xóa</button>
      <button onClick={() => handleEdit(task.id)} className="edit-task-button">Sửa</button>
    </li>
  ))}
</ul>

      <Button type="primary" onClick={showAddTaskModal} className="add-task-button">
        Thêm Mới
      </Button>

      {/* Modal for adding/editing task */}
      <Modal
        title={newTask.id ? "Edit Task" : "Add New Task"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Hủy</Button>,
          <Button key="save" type="primary" onClick={handleSaveTask}>Lưu</Button>,
        ]}
      >
        <Input
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ marginBottom: '10px' }}
        />
        <DatePicker
          placeholder="Due Date"
          value={newTask.dueDate ? dayjs(newTask.dueDate) : null}
          onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
          style={{ width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default TodoList;
