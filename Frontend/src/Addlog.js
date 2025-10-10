import React from 'react'
import './Addlog.css'
import { useState } from 'react';
import Navbar from './components/Navbar';
import axios from 'axios';

function Addlog() {
    const [formData, setFormData] = useState({
        Machine_ID: '',
        Date: '',
        Time: '',
        Service: '',
        Description: '',
        Cost: '',
        Downtime: '',
    });

    const [error, setError] = useState({});
    const validate = () => {
        let errors = {};
        if (!formData.Machine_ID) {
            errors.Machine_ID = "Machine ID is required";
        }
        if (!formData.Date) {
            errors.Date = "Date is required";
        }
        if (!formData.Time) {
            errors.Time = "Time is required";
        }
        if (!formData.Service) {
            errors.Service = "Type of Service is required";
        }
        if (!formData.Description) {
            errors.Description = "Issue Description is required";
        }
        if (!formData.Cost) {
            errors.Cost = "Service Cost is required";
        }
        if (!formData.Downtime) {
            errors.Downtime = "Downtime is required";
        }
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;
    try {
      await axios.post('http://localhost:5000/logs', formData);
      alert('Log added successfully!');
      setFormData({
        Machine_ID: '',
        Date: '',
        Time: '',
        Service: '',
        Description: '',
        Cost: '',
        Downtime: '',
      });
      setError({});
    } catch (error) {
      console.error(error);
      alert('Error submitting log');
    }
  };

    return (
    <div className="addlog">
        <Navbar />
        <div className="addlog-container">
            <form onSubmit={handleSubmit}>
                <h1>Add Maintenance Log</h1>
                <label>Machine ID:</label>
                <input type="text" name="Machine_ID" value={formData.Machine_ID} onChange={handleChange} />
                {error.Machine_ID && <span className="error">{error.Machine_ID}</span>}

                <label>Date:</label>
                <input type="date" name="Date" value={formData.Date} onChange={handleChange} />
                {error.Date && <span className="error">{error.Date}</span>}

                <label>Time:</label>
                <input type="time" name="Time" value={formData.Time} onChange={handleChange} />
                {error.Time && <span className="error">{error.Time}</span>}

                <label>Type of Service:</label>
                <select type="text" name="Service" value={formData.Service} onChange={handleChange}>
                <option value="">Select Service Type</option>
                <option value="general">General</option>
                <option value="monthly">Monthly</option>
                <option value="quaterly">Quarterly</option>
                <option value="half-yearly">Half Yearly</option>
                <option value="yearly">Yearly</option>
                <option value="breakdown">Breakdown</option>
                </select>
                {error.Service && <span className="error">{error.Service}</span>}

                <label>Issue Description:</label>
                <textarea name="Description" value={formData.Description} onChange={handleChange}></textarea>
                {error.Description && <span className="error">{error.Description}</span>}

                <label>Service Cost (₹):</label>
                <input type="number" name="Cost" value={formData.Cost} onChange={handleChange} />
                {error.Cost && <span className="error">{error.Cost}</span>}

                <label>Downtime(In Hours):</label>
                <input type="text" name="Downtime" value={formData.Downtime} onChange={handleChange} />
                {error.Downtime && <span className="error">{error.Downtime}</span>}

                <button type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
}

export default Addlog;
