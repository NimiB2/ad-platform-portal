import React, { useState, useEffect } from 'react';
import { getAds, deleteAd, getCurrentUser, getPerformerId } from '../api';

const Dashboard = ({ onLogout, onEditAd, onViewStats, onNewAd }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();
  const performerId = getPerformerId();
  const isDeveloper = currentUser === 'developer@example.com';
  
  // Add this to recognize returning users
  const isReturningUser = localStorage.getItem('hasVisitedBefore') === 'true';

  useEffect(() => {
    // Mark user as having visited
    localStorage.setItem('hasVisitedBefore', 'true');
    
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const userAds = await getAds(); // This now returns only user's ads
      setAds(userAds);
    } catch (err) {
      setError('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    
    try {
      await deleteAd(id);
      fetchAds(); // Refresh list
    } catch (err) {
      setError('Failed to delete ad');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      {isReturningUser && (
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px' 
        }}>
          Welcome back! Good to see you again.
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard</h2>
        <div>
          <button
            onClick={onNewAd}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            New Ad
          </button>
          
          <button
            onClick={onLogout}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2>Dashboard</h2>
      <div>
        <button
          onClick={() => onViewAllStats()} // Add this new prop for the Dashboard component
          style={{
            backgroundColor: '#FF9800',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          View All Stats
        </button>
        
        <button
          onClick={onNewAd}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          New Ad
        </button>
        
        <button
          onClick={onLogout}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>


      <h3>Your Ads</h3>
      {ads.length === 0 ? (
        <p>No ads found. Create your first ad!</p>
      ) : (
        <div>
          {ads.map(ad => (
            <div
              key={ad._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '15px'
              }}
            >
              <h3>{ad.name}</h3>
              <p><strong>Video URL:</strong> {ad.adDetails.videoUrl}</p>
              <p><strong>Target URL:</strong> {ad.adDetails.targetUrl}</p>
              <p><strong>Budget:</strong> {ad.adDetails.budget}</p>
              
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={() => onEditAd(ad)}
                  style={{
                    backgroundColor: '#2196F3',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => onViewStats(ad._id)}
                  style={{
                    backgroundColor: '#FF9800',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  View Stats
                </button>
                
                <button
                  onClick={() => handleDelete(ad._id)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
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
  );
};

export default Dashboard;