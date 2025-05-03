import React, { useState, useEffect } from 'react';
import { createAd, updateAd, getCurrentUser } from '../api';

const AdForm = ({ ad, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    adName: '',
    performerEmail: getCurrentUser(),
    adDetails: {
      videoUrl: '',
      targetUrl: '',
      budget: 'low',
      skipTime: 5,
      exitTime: 30
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Load existing ad data if editing
  useEffect(() => {
    if (ad) {
      setFormData({
        adName: ad.name,
        performerEmail: getCurrentUser(),
        adDetails: {
          videoUrl: ad.adDetails.videoUrl,
          targetUrl: ad.adDetails.targetUrl,
          budget: ad.adDetails.budget,
          skipTime: ad.adDetails.skipTime,
          exitTime: ad.adDetails.exitTime
        }
      });
    }
  }, [ad]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (ad) {
        await updateAd(ad._id, formData);
      } else {
        await createAd(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save ad');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>{ad ? 'Edit Ad' : 'Create New Ad'}</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="adName">Ad Name:</label>
          <input
            type="text"
            id="adName"
            name="adName"
            value={formData.adName}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="videoUrl">Video URL:</label>
          <input
            type="url"
            id="videoUrl"
            name="adDetails.videoUrl"
            value={formData.adDetails.videoUrl}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
          <small>Direct link to video file (MP4)</small>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="targetUrl">Target URL:</label>
          <input
            type="url"
            id="targetUrl"
            name="adDetails.targetUrl"
            value={formData.adDetails.targetUrl}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
          <small>Where users will go after clicking the ad</small>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="budget">Budget:</label>
          <select
            id="budget"
            name="adDetails.budget"
            value={formData.adDetails.budget}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="skipTime">Skip Time (seconds):</label>
          <input
            type="number"
            id="skipTime"
            name="adDetails.skipTime"
            value={formData.adDetails.skipTime}
            onChange={handleInputChange}
            min="0"
            step="0.1"
            required
            style={{ width: '100%', padding: '8px' }}
          />
          <small>When the skip button appears</small>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="exitTime">Exit Time (seconds):</label>
          <input
            type="number"
            id="exitTime"
            name="adDetails.exitTime"
            value={formData.adDetails.exitTime}
            onChange={handleInputChange}
            min="0"
            step="0.1"
            required
            style={{ width: '100%', padding: '8px' }}
          />
          <small>When the exit button appears</small>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            {loading ? 'Saving...' : (ad ? 'Update' : 'Create')}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdForm;