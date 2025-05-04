// src/components/AllAdStats.js
import React, { useState, useEffect } from 'react';
import { getPerformerStats } from '../api';

// We'll reuse the same Bar component
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

const AllAdStats = ({ onBack }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await getPerformerStats();
        setStats(statsData);
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!stats) return <div>No statistics available</div>;

  // Calculate totals across all ads
  const totals = {
    views: stats.adsStats.reduce((sum, ad) => sum + ad.views, 0),
    clicks: stats.adsStats.reduce((sum, ad) => sum + ad.clicks, 0),
    skips: stats.adsStats.reduce((sum, ad) => sum + ad.skips, 0),
    avgWatchDuration: stats.adsStats.length > 0 
      ? stats.adsStats.reduce((sum, ad) => sum + ad.avgWatchDuration, 0) / stats.adsStats.length 
      : 0,
    clickThroughRate: stats.adsStats.length > 0 
      ? stats.adsStats.reduce((sum, ad) => sum + ad.clickThroughRate, 0) / stats.adsStats.length 
      : 0
  };

  // Find max values for scaling the bars
  const maxCount = Math.max(totals.views, totals.clicks, totals.skips);
  const maxRate = Math.max(totals.clickThroughRate);

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

      <h2>Statistics for All Your Ads</h2>

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
          <div style={{ fontSize: '14px' }}>Total Views</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.views}</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#e8f5e9', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Total Clicks</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.clicks}</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#fff8e1', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Average CTR</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.clickThroughRate.toFixed(2)}%</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#f3e5f5', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Avg. Watch Duration</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.avgWatchDuration.toFixed(2)}s</div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Event Counts</h3>
        <Bar label="Views" value={totals.views} maxValue={maxCount} color="#2196F3" />
        <Bar label="Clicks" value={totals.clicks} maxValue={maxCount} color="#4CAF50" />
        <Bar label="Skips" value={totals.skips} maxValue={maxCount} color="#FF9800" />
      </div>

      <div>
        <h3>Performance Rates</h3>
        <Bar label="Average Click-Through Rate (%)" value={totals.clickThroughRate} maxValue={maxRate} color="#9C27B0" />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Individual Ad Performance</h3>
        {stats.adsStats.map((adStat, index) => (
          <div key={index} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            padding: '15px', 
            marginBottom: '15px' 
          }}>
            <h4>Ad ID: {adStat.adId}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              <div>Views: {adStat.views}</div>
              <div>Clicks: {adStat.clicks}</div>
              <div>CTR: {adStat.clickThroughRate.toFixed(2)}%</div>
              <div>Avg Duration: {adStat.avgWatchDuration.toFixed(2)}s</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAdStats;