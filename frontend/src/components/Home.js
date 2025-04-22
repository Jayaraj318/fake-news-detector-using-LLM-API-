import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [newsText, setNewsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckNews = async () => {
    if (!newsText.trim()) {
      setError('Please enter some news text to check.');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.get('http://localhost:8000/check-news', {
        params: { text: newsText },
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to check news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: 30 }}>
        <h2 style={{ fontSize: '2.5rem', color: '#34495e' }}>Fake News Detection using Gemini AI</h2>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          Detect whether a news article is real or fake using Google's Gemini LLM.
        </p>
        <button
          onClick={() => document.getElementById('news-input').focus()}
          style={{
            marginTop: 15,
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#2980b9',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Try it Now
        </button>
      </header>

      <section style={{ marginBottom: 20 }}>
        <textarea
          id="news-input"
          rows={8}
          placeholder="Paste your news article or paragraph here..."
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          style={{
            width: '100%',
            padding: 15,
            fontSize: '1rem',
            borderRadius: 5,
            border: '1px solid #bdc3c7',
            resize: 'vertical',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        />
      </section>

      <button
        onClick={handleCheckNews}
        disabled={loading}
        style={{
          padding: '10px 30px',
          fontSize: '1.1rem',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 20,
        }}
      >
        {loading ? 'Checking...' : 'Check News'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {result && (
        <section
          style={{
            padding: 20,
            borderRadius: 5,
            backgroundColor: '#ecf0f1',
            color: '#2c3e50',
          }}
        >
          <h3>✅ Final Verdict: {result.verdict}</h3>
          <p>🧠 Reason: {result.reason}</p>
        </section>
      )}
    </div>
  );
};

export default Home;
