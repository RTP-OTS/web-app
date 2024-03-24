const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'staff_management',
  password: '123456',
  port: 5432,
});

// Middleware สำหรับการแปลงข้อมูลที่รับเข้ามาเป็น JSON
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});

app.post('/staff', async (req, res) => {
  const { username } = req.body; // รับข้อมูล username จาก body

  try {
    if (!username) {
      return res.status(400).json({ message: 'กรุณาระบุชื่อผู้ใช้' });
    }
    const result = await pool.query('SELECT s.staff_id , s.first_name , s.last_name , s."position" , s.company  FROM public.users u  inner join public.staff s on u.username = s.username where u.username = $1', [username]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'ไม่พบข้อมูล staff สำหรับผู้ใช้นี้' });
    }
  } catch (error) {
    console.error('Error fetching staff data:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล staff' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ' , username: username});
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
