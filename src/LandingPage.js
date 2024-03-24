import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = ({ username, onLogout }) => {
const navigate = useNavigate();
const [staffData, setStaffData] = useState([]);
const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let user = window.localStorage.getItem("username")
    console.log(' useEffect '+  user)
    if (user) {
      fetchStaffData(user);
    }
  }, [username]);

  const fetchStaffData = async (username) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      setStaffData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Hello, {username} Welcome!</h2>
        <p id='heading'>This is your information:</p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr id='headingtable'>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Position</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {staffData.length > 0 ? (
                staffData.map((staff) => (
                  <tr key={staff.staff_id}>
                    <td id='fname'>{staff.first_name}</td>
                    <td id='lname'>{staff.last_name}</td>
                    <td id='position'>{staff.position}</td>
                    <td id='company'>{staff.company}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Can not your information</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <br></br>
        <button className="button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default LandingPage;
