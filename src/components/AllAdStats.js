// src/components/AllAdStats.js
import React, { useState, useEffect } from 'react';
import { getPerformerStats, getAllPerformers, getCurrentUser } from '../api';
import axios from 'axios';
import Chart from 'react-apexcharts';

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
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dailyData, setDailyData] = useState(null);
  const [rangeError, setRangeError] = useState(null);

  const handleToggleGraph = async () => {
    if (dailyData) {
      setDailyData(null);
      return;
    }
    if (!fromDate || !toDate) {
      setRangeError('Please choose a valid date range');
      return;
    }
    try {
      const days = [];
      let d = new Date(fromDate);
      const end = new Date(toDate);
      while (d <= end) {
        days.push(d.toISOString().slice(0, 10));
        d.setDate(d.getDate() + 1);
      }
      const reqs = days.map(date =>
        axios.get('/api/ads/stats', { params: { from: date, to: date } })
          .then(res => ({
            date,
            views:  res.data.views,
            clicks: res.data.clicks,
            skips:  res.data.skips,
          }))
      );
      const daily = await Promise.all(reqs);
      setDailyData(daily);
      setRangeError(null);
    } catch {
      setRangeError('Error fetching data');
    }
  };
  
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
        } else {
          // Fetch stats only for current user
          const statsData = await getPerformerStats();
          setStats(statsData);
        }
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
  
  // For regular user
  if (!isDeveloper) {
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

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button
          onClick={handleToggleGraph}
          style={{
            backgroundColor: dailyData ? '#f44336' : '#2196F3',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {dailyData ? 'Hide graph' : 'Show graph'}
        </button>
        {rangeError && <span style={{ color: 'red' }}>{rangeError}</span>}
      </div>


      {dailyData && (
        <div style={{ height: '320px', marginTop: '30px', marginBottom: '40px' }}>
          <h3>Daily Trend (All Ads)</h3>
          <Chart
            type="area"
            height={300}
            series={[
              { name: 'Views',  data: dailyData.map(d => [d.date, d.views])  },
              { name: 'Clicks', data: dailyData.map(d => [d.date, d.clicks]) },
              { name: 'Skips',  data: dailyData.map(d => [d.date, d.skips])  },
            ]}
            options={{
              colors: ['#2196F3', '#4CAF50', '#FF9800'],
              stroke: { curve: 'smooth', width: 0 },
              markers:{ size: 4, strokeWidth: 0 },
              fill:   { opacity: 0.25 },
              xaxis:  { type: 'datetime' },
              tooltip:{ x: { format: 'yyyy-MM-dd' } },
              legend: { position: 'top' },
              grid:   { strokeDashArray: 3, borderColor: '#9e9e9e' },
              dataLabels: {
                enabled: true,
                formatter: val => (val === 0 ? '' : val),
                style: { fontWeight: '700' }
              }
            }}
          />
        </div>
      )}

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
  }
  
  // For developer view (showing all performers)
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
  );
};

export default AllAdStats;