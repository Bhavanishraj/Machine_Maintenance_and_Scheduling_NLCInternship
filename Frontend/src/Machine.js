import React, { useEffect, useState } from 'react';
import './Machine.css';
import Navbar from './components/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function Machine() {
  const [machineData, setMachineData] = useState({});
  const [scheduleData, setScheduleData] = useState([]);
  const [futureSchedules, setFutureSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/logs`)
      .then(response => {
        // Use loose comparison (or convert types)
        const filteredLogs = response.data.filter(log => log.Machine_ID === id);
        setLogs(filteredLogs);
        calculateStats(filteredLogs);
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
      });
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:5000/schedules/${id}`)
      .then(response => {
        setScheduleData(response.data);
      })
      .catch(error => {
        console.error('Error fetching schedules:', error);
      });
  }, [id]);

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await axios.delete(`http://localhost:5000/schedule/${scheduleId}`);
      setFutureSchedules(futureSchedules.filter(sch => sch.id !== scheduleId));
      alert('Schedule deleted successfully!');
    } catch (error) {
      alert('Error deleting schedule');
      console.error(error);
    }
  };

  const calculateStats = (data) => {
    let totalCost = 0;
    let totalDowntime = 0;

    data.forEach(log => {
      totalCost += parseFloat(log.Cost) || 0;
      totalDowntime += parseFloat(log.Downtime) || 0;
    });

    setMachineData({
      Machine_ID: id,
      totalLogs: data.length,
      totalCost,
      totalDowntime
    });

  };
const labels = logs.map(log => log.Date);
  const costData = {
    labels,
    datasets: [
      {
        label: 'Cost (₹)',
        data: logs.map(log => parseFloat(log.Cost) || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
      }
    ]
  };
  const downtimeData = {
    labels,
    datasets: [
      {
        label: 'Downtime (hrs)',
        data: logs.map(log => parseFloat(log.Downtime) || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };
 return (
  <div className="machine">
    <Navbar />
    <div className="machine-content">
      <div className="details-card">
        <h2>Machine ID: {machineData.Machine_ID}</h2>
        <p>Total Logs: {machineData.totalLogs}</p>
        <p>Total Cost: ₹{machineData.totalCost}</p>
        <p>Total Downtime: {machineData.totalDowntime} hrs</p>
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
        </tr>
    </thead>
    <tbody>
        {logs.map((log) => (
        <tr key={log.id}>
            <td>{log.Machine_ID}</td>
            <td>{log.Date}</td>
            <td>{log.Time}</td>
            <td>{log.Service}</td>
            <td>{log.Description}</td>
            <td>{log.Cost}</td>
            <td>{log.Downtime}</td>
        </tr>
        ))}
    </tbody>
    </table>
    <h2>Future Schedules</h2>
<table className="mlog-table">
  <thead>
    <tr>
      <th>Date</th>
      <th>Time</th>
      <th>Service</th>
      <th>Description</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {scheduleData.length === 0 ? (
      <tr>
        <td colSpan="4">No future schedules found</td>
      </tr>
    ) : (
      scheduleData.map((sch) => (
        <tr key={sch.id}>
          <td>{new Date(sch.date).toLocaleDateString()}</td>
          <td>{sch.time}</td>
          <td>{sch.service}</td>
          <td>{sch.description}</td>
          <td>
                <button className="delete-btn"
                onClick={() => handleDelete(sch.id)}>Delete</button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
        <button
          className="back-btn"
          onClick={() => (window.location.href = '/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Right panel */}
      <div className="chart-panel">
        <div className="charts-ct">
          <h2>Cost Trend</h2>
          <Line data={costData} options={options} />
        </div>
        <div className="charts-dt">
          <h2>Downtime Trend</h2>
          <Line data={downtimeData} options={options} />
        </div>
      </div>
    </div>
  </div>
);
}
export default Machine;