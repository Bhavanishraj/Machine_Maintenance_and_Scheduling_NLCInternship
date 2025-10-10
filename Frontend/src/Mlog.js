import React from 'react'
import './Mlog.css'
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import axios from 'axios';


function Mlog() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/logs')
            .then((response) => {
                setLogs(response.data);
            })
            .catch((error) => {
                console.error('Error fetching logs:', error);
            });
    }, []);

    const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      axios.delete(`http://localhost:5000/logs/${id}`)
        .then(() => {
          // Remove deleted log from state
          setLogs(logs.filter(log => log.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting log:', error);
        });
    }
  };


  return (
    <div className="mlog-container">
      <Navbar />
    <table className="mlog-table">
      <thead>
        <tr>
          <th>Machine ID</th>
          <th>Date</th>
          <th>Time</th>
          <th>Service</th>
          <th>Description</th>
          <th>Cost(₹)</th>
          <th>Downtime</th>
          <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {logs.map((log) => (
        <tr key={log.id}>
            <td>{log.Machine_ID}</td>
            <td>{log.Date}</td>
            <td>
              {log.Time}</td>
            <td>{log.Service}</td>
            <td>{log.Description}</td>
            <td>{log.Cost}</td>
            <td>{log.Downtime}</td>
            <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(log.id)}
                >
                  Delete
                </button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
    </div>
  )
}

export default Mlog