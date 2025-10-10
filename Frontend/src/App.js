import {Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './Login';
import Navbar from './components/Navbar';
import Dashboard from './Dashboard';
import Addlog from './Addlog';
import Mlog from './Mlog';
import Machine from './Machine';   
import Schedule from './Schedule';


function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/navbar" element={<Navbar/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/addlog" element={<Addlog />} />
        <Route path="/mlog" element={<Mlog />} />
        <Route path="/machine/:id" element={<Machine />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
  );
}

export default App;
