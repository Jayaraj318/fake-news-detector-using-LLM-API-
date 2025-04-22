import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

const App = () => {
  return (
    <Router>
      <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: 900, margin: 'auto', padding: 20 }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ color: '#2c3e50' }}>Fake News Detection</h1>
          <div>
            <Link to="/" style={{ marginRight: 15, textDecoration: 'none', color: '#2980b9' }}>Home</Link>
            <Link to="/about" style={{ marginRight: 15, textDecoration: 'none', color: '#2980b9' }}>About</Link>
            <Link to="/contact" style={{ textDecoration: 'none', color: '#2980b9' }}>Contact</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <footer style={{ marginTop: 40, textAlign: 'center', color: '#7f8c8d' }}>
          &copy; 2024 Fake News Detection using Gemini AI
        </footer>
      </div>
    </Router>
  );
};

export default App;
