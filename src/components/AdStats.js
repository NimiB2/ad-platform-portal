import React, { useState, useEffect } from 'react';
import { getAdStats, getAdById } from '../api';

// Simple bar component for charts
const Bar = ({ label, value, maxValue, color }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div style={{ background: '#eee', height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
      <div 
        style={{ 
          background: color, 
          height: '100%', 
          width: `${Math.min(100, (value / maxValue) * 100)}%`,
        }} 
      />
    </div>
  </div>
);

const AdStats = ({ adId, onBack }) => {
  const [stats, setStats] = useState(null);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both the ad details and stats
        const [adData, statsData] = await Promise.all([
          getAdById(adId),
          getAdStats(adId)
        ]);
        setAd(adData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adId]);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!stats || !ad) return <div>No statistics available</div>;

  // Find the maximum value for scaling the bars
  const eventCounts = [
    stats.adStats.views,
    stats.adStats.clicks,
    stats.adStats.skips
  ];
  const maxCount = Math.max(...eventCounts);

  const rateValues = [
    stats.adStats.clickThroughRate,
    stats.adStats.conversionRate
  ];
  const maxRate = Math.max(...rateValues);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <h2>Statistics for "{ad.name}"</h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px',
        marginTop: '20px'
      }}>
        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#e3f2fd', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Views</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.adStats.views}</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#e8f5e9', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Clicks</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.adStats.clicks}</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#fff8e1', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Click-Through Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.adStats.clickThroughRate}%</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#f3e5f5', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Avg. Watch Duration</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.adStats.avgWatchDuration}s</div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Event Counts</h3>
        <Bar label="Views" value={stats.adStats.views} maxValue={maxCount} color="#2196F3" />
        <Bar label="Clicks" value={stats.adStats.clicks} maxValue={maxCount} color="#4CAF50" />
        <Bar label="Skips" value={stats.adStats.skips} maxValue={maxCount} color="#FF9800" />
      </div>

      <div>
        <h3>Performance Rates</h3>
        <Bar label="Click-Through Rate (%)" value={stats.adStats.clickThroughRate} maxValue={maxRate} color="#9C27B0" />
        <Bar label="Conversion Rate (%)" value={stats.adStats.conversionRate} maxValue={maxRate} color="#E91E63" />
      </div>
    </div>
  );
};

export default AdStats;