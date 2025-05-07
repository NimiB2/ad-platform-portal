import React, { useState, useEffect } from 'react';
import { getAds, getAllPerformers } from '../api';

const AdminView = () => {
  const [performers, setPerformers] = useState([]);
  const [ads, setAds] = useState([]);
  const [loadingPerformers, setLoadingPerformers] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);
  const [errorPerformers, setErrorPerformers] = useState('');
  const [errorAds, setErrorAds] = useState('');

  // useEffect for fetching performers
  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        setLoadingPerformers(true);
        const performersData = await getAllPerformers();
        setPerformers(performersData);
        localStorage.setItem('performers', JSON.stringify(performersData));
      } catch (err) {
        setErrorPerformers('Failed to load performers data');
        const storedPerformers = localStorage.getItem('performers');
        if (storedPerformers) {
          setPerformers(JSON.parse(storedPerformers));
        }
      } finally {
        setLoadingPerformers(false);
      }
    };

    // Try to get from localStorage first
    const storedPerformers = localStorage.getItem('performers');
    if (storedPerformers) {
      setPerformers(JSON.parse(storedPerformers));
      setLoadingPerformers(false);
    }
    
    fetchPerformers();
  }, []);

  // useEffect for fetching ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoadingAds(true);
        const adsData = await getAds(true);
        setAds(adsData);
        localStorage.setItem('ads', JSON.stringify(adsData));
      } catch (err) {
        setErrorAds('Failed to load ads data');
        const storedAds = localStorage.getItem('ads');
        if (storedAds) {
          setAds(JSON.parse(storedAds));
        }
      } finally {
        setLoadingAds(false);
      }
    };

    // Try to get from localStorage first
    const storedAds = localStorage.getItem('ads');
    if (storedAds) {
      setAds(JSON.parse(storedAds));
      setLoadingAds(false);
    }
    
    fetchAds();
  }, []);

  // Common styles for consistency
  const sectionStyle = {
    marginBottom: '30px'
  };
  
  const containerStyle = {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const itemStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '15px'
  };
  
  const headerStyle = {
    color: '#3f51b5',
    fontSize: '20px',
    borderBottom: '2px solid #eee',
    paddingBottom: '8px',
    marginBottom: '12px'
  };

  // Loading and error handling
  if (loadingPerformers && loadingAds) return <div>Loading admin data...</div>;
  
  return (
    <div>
      {/* Performers Section */}
      <div style={sectionStyle}>
        <h3>All Performers ({performers.length})</h3>
        {errorPerformers && <div style={{ color: 'red' }}>{errorPerformers}</div>}
        {loadingPerformers ? (
          <div>Loading performers...</div>
        ) : (
          <div style={containerStyle}>
            {performers.map((performer) => (
              <div key={performer._id} style={itemStyle}>
                <h3 style={headerStyle}>{performer.name}</h3>
                <p><strong>Email:</strong> {performer.email}</p>
                <p><strong>ID:</strong> {performer._id}</p>
                <p><strong>Ads:</strong> {performer.ads ? performer.ads.length : 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ads Section */}
      <div style={sectionStyle}>
        <h3>All Ads ({ads.length})</h3>
        {errorAds && <div style={{ color: 'red' }}>{errorAds}</div>}
        {loadingAds ? (
          <div>Loading ads...</div>
        ) : (
          <div style={containerStyle}>
            {ads.map((ad) => (
              <div key={ad._id} style={itemStyle}>
                <h3 style={headerStyle}>{ad.title || 'Untitled Ad'}</h3>
                <p><strong>Video URL:</strong> {ad.videoUrl}</p>
                <p><strong>Target URL:</strong> {ad.targetUrl}</p>
                <p><strong>Budget:</strong> {ad.budget}</p>
                <div>
                  <button 
                    style={{
                      backgroundColor: '#4285f4',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      marginRight: '10px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    style={{
                      backgroundColor: '#f4a742',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      marginRight: '10px'
                    }}
                  >
                    View Stats
                  </button>
                  <button 
                    style={{
                      backgroundColor: '#f44242',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;