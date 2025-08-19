const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hello@123',
  database: 'maintenance_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// Store all logs
app.post('/logs', (req, res) => {
  const { Machine_ID, Date, Time, Service, Description, Cost, Downtime } = req.body;

  const sql = `
    INSERT INTO maintenance_logs
    (Machine_ID, Date, Time, Service, Description, Cost, Downtime)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [Machine_ID, Date, Time, Service, Description, Cost, Downtime], (err, result) => {
    if (err) {
      console.error('❌ Error inserting log:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: '✅ Log added successfully' });
  });
});
//Fetch all logs
app.get('/logs', (req, res) => {
    const sql = `SELECT id, Machine_ID, 
        DATE_FORMAT(Date, '%d/%m/%Y') AS Date, 
        Time, Service, Description, Cost, Downtime
        FROM maintenance_logs 
        ORDER BY Date DESC, Time DESC`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error fetching logs:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});
//Delete any log
app.delete('/logs/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM maintenance_logs WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting log:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Log deleted successfully' });
  });
});

  // ==================== GET MACHINE LIST ====================
app.get('/machines', (req, res) => {
    const sql = `
        SELECT DISTINCT machine_id AS id, 
               CONCAT('Machine ', machine_id) AS name
        FROM maintenance_logs
        ORDER BY machine_id ASC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching machines:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// ==================== SCHEDULE MAINTENANCE ====================
app.post('/schedule', (req, res) => {
    const { machine_id, date, time, service, description } = req.body;

    if (!machine_id || !date || !time || !service || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        INSERT INTO schedule (machine_id, date, time, service, description)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [machine_id, date, time, service, description], (err, result) => {
        if (err) {
            console.error('Error inserting schedule:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Schedule added successfully', id: result.insertId });
    });
});
// ==================== Next Schedule ====================
app.get('/schedule/:machine_id', (req, res) => {
    const { machine_id } = req.params;

    const sql = `
        SELECT date 
        FROM schedule 
        WHERE machine_id = ? 
        ORDER BY date ASC
        LIMIT 1
    `;
    db.query(sql, [machine_id], (err, results) => {
        if (err) {
            console.error('Error fetching next schedule:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(200).json({ nextDate: null });
        }
        const formattedDate = results[0].date.toISOString().split('T')[0];

        res.status(200).json({
            nextDate: formattedDate
        });
    });
});


// ==================== All Future Schedules ====================
app.get('/schedules/:machine_id', (req, res) => {
    const { machine_id } = req.params;

    const sql = `
        SELECT id, machine_id, date, time, service, description
        FROM schedule
        WHERE machine_id = ?
          AND date >= CURDATE()
        ORDER BY date ASC, time ASC
    `;

    db.query(sql, [machine_id], (err, results) => {
        if (err) {
            console.error('Error fetching schedules:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

app.delete('/schedule/:schedule_id', (req, res) => {
  const { schedule_id } = req.params;
  const sql = 'DELETE FROM schedule WHERE id = ?';

  db.query(sql, [schedule_id], (err, result) => {
    if (err) {
      console.error('Error deleting schedule:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.status(200).json({ message: 'Schedule deleted successfully' });
  });
});
