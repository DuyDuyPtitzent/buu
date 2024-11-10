const mysql = require('mysql2');
require('dotenv').config(); // Dùng dotenv để tải các biến môi trường

// Tạo kết nối đến cơ sở dữ liệu
const db = mysql.createConnection({
    host: 'localhost',  // host của CSDL
    user: 'root',       // tên tài khoản kết nối đến CSDL
   
    database: 'api'     // Tên cơ sở dữ liệu đã tạo
});

// Kết nối đến cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('Kết nối cơ sở dữ liệu thất bại:', err.stack);
        return;
    }
    console.log('Đã kết nối tới cơ sở dữ liệu MySQL.');
});

module.exports = db;
