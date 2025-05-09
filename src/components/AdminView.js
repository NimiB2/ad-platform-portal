import React, { useState, useEffect } from 'react';
import { getAds, getAllPerformers } from '../api';

const AdminView = () => {
  const [performers, setPerformers] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [performersData, adsData] = await Promise.all([
          getAllPerformers(),
          getAds(true) // true flag to get all ads, not just user's ads
        ]);
        setPerformers(performersData);
        setAds(adsData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading admin data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>      
      <div style={{ marginBottom: '30px' }}>
        <h3>All Performers ({performers.length})</h3>
        {performers.map(performer => (
          <div
            key={performer._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              marginBottom: '15px'
            }}
          >
            <h4>{performer.name}</h4>
            <p><strong>Email:</strong> {performer.email}</p>
            <p><strong>ID:</strong> {performer._id}</p>
            <p><strong>Ads:</strong> {performer.ads ? performer.ads.length : 0}</p>
          </div>
        ))}
      </div>
      </div>
  );
};

export default AdminView;