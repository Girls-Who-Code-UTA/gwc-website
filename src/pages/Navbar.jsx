// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
        <div className="nav-left">
            <h2 className="nav-logo">Girls Who Code</h2>
        </div>
        <div className="nav-right">
            <Link to="/">Home</Link>
            <Link to="/about">Who We Are</Link>
            <Link to="/get-involved">Get Involved</Link>
            <Link to="/calendar">Calendar</Link>
        </div>
        </nav>
    );
}