import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Navbar from './components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/logs')
      .then(response => {
        setLogs(response.data);
        calculateMachineValues(response.data);
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
      });
  }, []);

  const calculateMachineValues = async (data) => {
    const machineValues = {};

    // aggregate logs by machine
    data.forEach(log => {
      const id = log.Machine_ID;
      const cost = parseFloat(log.Cost) || 0;
      const downtime = parseFloat(log.Downtime) || 0;

      if (!machineValues[id]) {
        machineValues[id] = {
          Machine_ID: id,
          totalLogs: 0,
          totalCost: 0,
          totalDowntime: 0,
          nextSchedule: null
        };
      }

      machineValues[id].totalLogs += 1;
      machineValues[id].totalCost += cost;
      machineValues[id].totalDowntime += downtime;
    });

    // fetch next schedule for each machine
    const machineArray = await Promise.all(
      Object.values(machineValues).map(async (machine) => {
        try {
          const response = await axios.get(`http://localhost:5000/schedule/${machine.Machine_ID}`);
          machine.nextSchedule = response.data.nextDate
            ? `${response.data.nextDate}`
            : "No upcoming schedule";
        } catch (error) {
          console.error(`Error fetching schedule for Machine ${machine.Machine_ID}`, error);
          machine.nextSchedule = "Error fetching schedule";
        }
        return machine;
      })
    );

    setMachines(machineArray);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-cards">
          {machines.map((machine, index) => (
            <div className="dashboard-card" key={index}>
              <h2>Machine ID: {machine.Machine_ID}</h2>
              <p>Total Logs: {machine.totalLogs}</p>
              <p>Total Cost: ₹{machine.totalCost}</p>
              <p>Total Downtime: {machine.totalDowntime} hours</p>
              <p>Next Schedule: {machine.nextSchedule}</p>
              <button className="more-details-btn"
                onClick={() => navigate(`/machine/${machine.Machine_ID}`)}>
                More Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
