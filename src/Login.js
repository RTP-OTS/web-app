import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate from react-router-dom
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ใช้ hook useNavigate เพื่อทำการนำทาง

  const handleLogin = async () => {
    if (!username || !password) {
      setError('โปรดใส่ชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/Login', {
        method: 'POST', // เปลี่ยนเป็น POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // ส่งข้อมูลผ่าน body
      });
  
      const data = await response.json(); // ดึงข้อมูล JSON จาก response
  
      if (response.ok) {
        console.log('เข้าสู่ระบบสำเร็จ');
        console.log(data);
        // นำทางไปยังหน้า LandingPage.js หลังจาก login สำเร็จ
        window.localStorage.setItem('username',data.username)
        navigate('/landingpage'); // ใช้ navigate เพื่อนำทางไปยังหน้า LandingPage
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('มีข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์:', error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Login App</h2>
        <input
          className={`input-field ${error && !username ? 'error' : ''}`}
          type="text"
          id='username'
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError('');
          }}
        />
        <input
          className={`input-field ${error && !password ? 'error' : ''}`}
          type="password"
          id='password'
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
        />
        {error && <p className="error-message" id='error-message'>{error}</p>}
        <button className="button" id='login-button' onClick={handleLogin}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
