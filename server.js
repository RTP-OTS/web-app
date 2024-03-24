const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// กำหนดการเชื่อมต่อกับฐานข้อมูล PostgreSQL
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'staff_management',
  password: 'your_password',
  port: 5432,
});

// Middleware สำหรับการแปลงข้อมูลที่รับเข้ามาเป็น JSON
app.use(express.json());

// Route เพื่อตรวจสอบการเข้าสู่ระบบ
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ' });
    } else {
      res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
});

// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middleware สำหรับการแจ้งเมื่อไม่พบเส้นทาง
app.use((req, res, next) => {
  res.status(404).send("ไม่พบหน้าที่คุณต้องการ");
});
