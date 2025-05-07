import React, { useState, useEffect } from 'react';
import { getAds, getAllPerformers } from '../api';

const AdminView = () => {
  const [performers, setPerformers] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Separate useEffect for fetching performers
  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        const performersData = await getAllPerformers();
        setPerformers(performersData);
      } catch (err) {
        setError('Failed to load performers data');
      }
    };

    fetchPerformers();
  }, []);

  // useEffect for fetching ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const adsData = await getAds(true);
        setAds(adsData);
      } catch (err) {
        setError('Failed to load ads data');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <div>Loading admin data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3>All Performers ({performers.length})</h3>

      {performers.map((performer) => (
        <div
          key={performer._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '15px',
            marginBottom: '15px'
          }}
        >
          <h3
            style={{
              color: '#3f51b5',
              fontSize: '20px',
              borderBottom: '2px solid #eee',
              paddingBottom: '8px',
              marginBottom: '12px'
            }}
          >
            {performer.name}
          </h3>

          <p>
            <strong>Email:</strong> {performer.email}
          </p>
          <p>
            <strong>ID:</strong> {performer._id}
          </p>
          <p>
            <strong>Ads:</strong> {performer.ads ? performer.ads.length : 0}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminView;