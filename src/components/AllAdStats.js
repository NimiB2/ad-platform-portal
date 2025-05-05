// src/components/AllAdStats.js
import React, { useState, useEffect } from 'react';
import { getPerformerStats, getAllPerformers, getCurrentUser } from '../api';
import axios from 'axios';

// Bar component for charts
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
  const [allPerformerStats, setAllPerformerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isDeveloper = getCurrentUser() === 'developer@example.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isDeveloper) {
          // Fetch all performers first
          const performers = await getAllPerformers();
          
          // Then fetch stats for each performer
          const statsPromises = performers.map(performer => 
            axios.get(`/api/performers/${performer._id}/stats`)
              .then(response => ({
                performerId: performer._id,
                performerName: performer.name,
                performerEmail: performer.email,
                stats: response.data
              }))
              .catch(() => ({
                performerId: performer._id,
                performerName: performer.name,
                performerEmail: performer.email,
                stats: { adsStats: [] }
              }))
          );
          
          const allStats = await Promise.all(statsPromises);
          setAllPerformerStats(allStats);
        }
        
        // Always fetch stats for current user, regardless of developer status
        const statsData = await getPerformerStats();
        setStats(statsData);
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDeveloper]);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
  // Calculate totals for current user
  if (!stats) return <div>No statistics available</div>;
  
  const userTotals = {
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
  const maxCount = Math.max(userTotals.views, userTotals.clicks, userTotals.skips);
  const maxRate = Math.max(userTotals.clickThroughRate);

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

      {/* Current user stats - always show */}
      <h2>Statistics for Your Ads</h2>

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
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userTotals.views}</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#e8f5e9', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Total Clicks</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userTotals.clicks}</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#fff8e1', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Average CTR</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userTotals.clickThroughRate.toFixed(2)}%</div>
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '4px', 
          backgroundColor: '#f3e5f5', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '14px' }}>Avg. Watch Duration</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userTotals.avgWatchDuration.toFixed(2)}s</div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Event Counts</h3>
        <Bar label="Views" value={userTotals.views} maxValue={maxCount} color="#2196F3" />
        <Bar label="Clicks" value={userTotals.clicks} maxValue={maxCount} color="#4CAF50" />
        <Bar label="Skips" value={userTotals.skips} maxValue={maxCount} color="#FF9800" />
      </div>

      <div>
        <h3>Performance Rates</h3>
        <Bar label="Average Click-Through Rate (%)" value={userTotals.clickThroughRate} maxValue={maxRate} color="#9C27B0" />
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

      {/* Developer-only section - stats for all advertisers */}
      {isDeveloper && (
        <div style={{ marginTop: '50px', borderTop: '2px solid #ddd', paddingTop: '30px' }}>
          <h2>Statistics for All Advertisers</h2>
          
          {allPerformerStats.length === 0 ? (
            <div>No performers found with statistics.</div>
          ) : (
            allPerformerStats.map((performer) => (
              <div 
                key={performer.performerId}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '20px'
                }}
              >
                <h3>{performer.performerName} ({performer.performerEmail})</h3>
                {performer.stats.adsStats.length === 0 ? (
                  <p>No ad statistics available for this performer.</p>
                ) : (
                  <>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                      gap: '15px', 
                      marginBottom: '15px',
                      marginTop: '15px'
                    }}>
                      <div style={{ 
                        padding: '15px', 
                        borderRadius: '4px', 
                        backgroundColor: '#e3f2fd', 
                        textAlign: 'center' 
                      }}>
                        <div style={{ fontSize: '14px' }}>Total Views</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          {performer.stats.adsStats.reduce((sum, ad) => sum + ad.views, 0)}
                        </div>
                      </div>

                      <div style={{ 
                        padding: '15px', 
                        borderRadius: '4px', 
                        backgroundColor: '#e8f5e9', 
                        textAlign: 'center' 
                      }}>
                        <div style={{ fontSize: '14px' }}>Total Clicks</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          {performer.stats.adsStats.reduce((sum, ad) => sum + ad.clicks, 0)}
                        </div>
                      </div>

                      <div style={{ 
                        padding: '15px', 
                        borderRadius: '4px', 
                        backgroundColor: '#fff8e1', 
                        textAlign: 'center' 
                      }}>
                        <div style={{ fontSize: '14px' }}>Average CTR</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          {(performer.stats.adsStats.reduce((sum, ad) => sum + ad.clickThroughRate, 0) / performer.stats.adsStats.length || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <h4>Individual Ads</h4>
                    {performer.stats.adsStats.map((adStat, index) => (
                      <div key={index} style={{ 
                        border: '1px solid #eee', 
                        borderRadius: '4px', 
                        padding: '10px', 
                        marginBottom: '10px' 
                      }}>
                        <p><strong>Ad ID:</strong> {adStat.adId}</p>
                        <p><strong>Views:</strong> {adStat.views} | <strong>Clicks:</strong> {adStat.clicks} | <strong>CTR:</strong> {adStat.clickThroughRate.toFixed(2)}%</p>
                        <p><strong>Skips:</strong> {adStat.skips} | <strong>Watch Duration:</strong> {adStat.avgWatchDuration.toFixed(2)}s</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllAdStats;