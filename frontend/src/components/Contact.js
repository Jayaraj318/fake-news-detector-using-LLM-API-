import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate submission
    setSubmitted(true);
  };

  return (
    <div style={{ color: '#34495e' }}>
      <h2>Contact Us</h2>
      {submitted ? (
        <p>Thank you for reaching out! We will get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: 5 }}>Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #bdc3c7' }}
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: 5 }}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #bdc3c7' }}
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: 5 }}>Message:</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #bdc3c7', resize: 'vertical' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2980b9',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
