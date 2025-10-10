import React, { useEffect, useState } from 'react'
import './Schedule.css'
import Navbar from './components/Navbar'
import axios from 'axios';

function Schedule() {
    const [formData, setFormData] = useState({
        machine_id: '',
        date: '',
        time: '',
        service: '',
        description: '',
    });
    const [machines, setMachines] = useState([]); // Add this line
    const [error, setError] = useState({});
    const validate = () => {
        let errors = {};
        if (!formData.machine_id) {
            errors.machine_id = "Machine ID is required";
        }
        if (!formData.date) {
            errors.date = "Date is required";
        }
        if (!formData.time) {
            errors.time = "Time is required";
        }
        if (!formData.service) {
            errors.service = "Service type is required";
        }
        if (!formData.description) {
            errors.description = "Issue description is required";
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
      await axios.post('http://localhost:5000/schedule', formData);
      alert('Log added successfully!');
      setFormData({
        machine_id: '',
        date: '',
        time: '',
        service: '',
        description: '',
      });
      setError({});
    } catch (error) {
      console.error(error);
      alert('Error submitting log');
    }
  };

  useEffect(() => {
        // Fetch machine list from your backend
        axios.get('http://localhost:5000/machines')
            .then(response => setMachines(response.data))
            .catch(error => console.error('Error fetching machines:', error));
    }, []);

  return (
    <div className="schedule-container">
      <Navbar />
        <form className="schedule-form" onSubmit={handleSubmit}>
          <h1>Schedule Maintenance</h1>
          <label>Machine ID:</label>
          <select name="machine_id" value={formData.machine_id} onChange={handleChange} required>
            <option value="">Select Machine</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.name}
                </option>
))}
</select>
          {error.machine_id && <span className="error">{error.machine_id}</span>}

          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          {error.date && <span className="error">{error.date}</span>}

          <label>Time:</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          {error.time && <span className="error">{error.time}</span>}

          <label>Service:</label>
          <select name="service" value={formData.service} onChange={handleChange} required>
            <option value="">Select Service Type</option>
            <option value="general">General</option>
            <option value="monthly">Monthly</option>
            <option value="quaterly">Quarterly</option>
            <option value="half-yearly">Half Yearly</option>
            <option value="yearly">Yearly</option>
            <option value="breakdown">Breakdown</option>
          </select>
          {error.service && <span className="error">{error.service}</span>}

          <label>Issue Description:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
          {error.description && <span className="error">{error.description}</span>}

          <button type="submit">Schedule</button>
        </form>
    </div>
  )
}

export default Schedule;
