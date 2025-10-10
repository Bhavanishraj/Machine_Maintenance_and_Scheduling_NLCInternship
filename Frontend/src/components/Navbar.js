import React from 'react'
import './Navbar.css'
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <ul className="navbar-item"><a href="/dashboard" className="navbar-link">Dashboard</a></ul>
          <ul className="navbar-item"><a href="/mlog" className="navbar-link">Maintenance Log</a></ul>
          <ul className="navbar-item"><a href="/addlog" className="navbar-link">Add Log</a></ul>
          <ul className="navbar-item"><a href="/schedule" className="navbar-link">Schedule</a></ul>
          <ul className="navbar-item"><a href="/login" className="navbar-link">Logout</a></ul>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar