const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const todoRoutes = require('./Src/routers/todoRoutes'); // Import các route

// Cấu hình CORS để cho phép frontend gọi API từ một cổng khác
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Cổng frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức cho phép
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware xử lý JSON
app.use(express.urlencoded({ extended: true })); // Middleware xử lý dữ liệu từ form

// Sử dụng router cho các yêu cầu liên quan đến todo
app.use('/api', todoRoutes); // Tất cả các route liên quan đến /api sẽ được xử lý qua todoRoutes

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
