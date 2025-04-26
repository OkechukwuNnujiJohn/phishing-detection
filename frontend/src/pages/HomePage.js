import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { storeOnBlockchain, getUserHistory } from '../services/blockchain';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [latestResult, setLatestResult] = useState(null);
  const [error, setError] = useState(null);
  const [userHistory, setUserHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getUserHistory();
      setUserHistory(history);
    };
    fetchHistory();
  }, []);

  const checkUrl = async () => {
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/combined-check`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check URL.');
      }

      const data = await response.json();
      setLatestResult({
        url,
        isPhishing: data.finalResult,
        isPhishingML: data.isPhishingML,
        isPhishingGoogle: data.isPhishingGoogle,
        isPhishingAbuseIPDB: data.isPhishingAbuseIPDB,
        abuseConfidenceScore: data.abuseConfidenceScore
      });

    } catch (err) {
      setError(err.message);
    }
  };

  const handleStoreBlockchain = async () => {
    if (latestResult) {
      await storeOnBlockchain(latestResult.url, latestResult.isPhishing);
      alert("Stored on blockchain!");
      const updatedHistory = await getUserHistory();
      setUserHistory(updatedHistory);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div>
      <Card>
        <Input 
          placeholder="Enter URL" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
        />
        <Button onClick={checkUrl}>Check URL</Button>
        <Button onClick={handleLogout}>Logout</Button>
      </Card>

      {error && (
        <Card>
          <p style={{ color: 'red' }}>⚠️ {error}</p>
        </Card>
      )}

      <Card>
        <Button onClick={handleStoreBlockchain} disabled={!latestResult}>
          Store on Blockchain
        </Button>
      </Card>

      <Card>
        <h3>Latest Result:</h3>
        {latestResult ? (
          <div>
            <p><strong>URL:</strong> {latestResult.url}</p>
            <p><strong>Final Result:</strong> {latestResult.isPhishing ? '🚨 Phishing' : '✅ Safe'}</p>
            <p><strong>ML Detection:</strong> {latestResult.isPhishingML ? '🚨 Phishing' : '✅ Safe'}</p>
            <p><strong>Google Safe Browsing:</strong> {latestResult.isPhishingGoogle ? '🚨 Phishing' : '✅ Safe'}</p>
            <p><strong>AbuseIPDB Detection:</strong> {latestResult.isPhishingAbuseIPDB ? '🚨 Phishing' : '✅ Safe'}</p>
            <p><strong>Abuse Confidence Score:</strong> {latestResult.abuseConfidenceScore || 'N/A'}</p>
          </div>
        ) : (
          <p>No searches yet.</p>
        )}
      </Card>

      <Card>
        <h3>My Search History (Blockchain):</h3>
        {userHistory.length > 0 ? (
          userHistory.map((record, index) => (
            <p key={index}>
              <strong>{record.url}</strong> - {record.isPhishing ? '🚨 Phishing' : '✅ Safe'}
            </p>
          ))
        ) : (
          <p>No history found.</p>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
