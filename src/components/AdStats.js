import React, { useState, useEffect } from 'react';
import { getAdStats, getAdById } from '../api';
import axios from 'axios';
import Chart from 'react-apexcharts';

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
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dailyData, setDailyData] = useState(null);
  const [rangeError, setRangeError] = useState(null);
  
  const handleToggleGraph = async () => {
    if (dailyData) {
      setDailyData(null);       // hide
      return;
    }
    if (!fromDate || !toDate) {
      setRangeError('Please choose a valid date range');
      return;
    }
    try {
      const requests = [];
      let d = new Date(fromDate);
      const end = new Date(toDate);
      while (d <= end) {
        const dateStr = d.toISOString().slice(0, 10);
        requests.push(
          axios.get(`/api/ads/${adId}/stats`, { params: { from: dateStr, to: dateStr } })
            .then(res => ({
              date: dateStr,
              views:  res.data.adStats.views,
              clicks: res.data.adStats.clicks,
              skips:  res.data.adStats.skips,
            }))
        );
        d.setDate(d.getDate() + 1);
      }
      const daily = await Promise.all(requests);
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

  const handleApplyRange = async () => {
    if (!fromDate || !toDate) {
      setRangeError('Please choose a valid date range');
      return;
    }
  
    // build list of YYYY‑MM‑DD strings between the two dates (inclusive)
    const days = [];
    let d = new Date(fromDate);
    const end = new Date(toDate);
    while (d <= end) {
      days.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 1);
    }
  
    try {
      const requests = days.map(date =>
        axios.get(`/api/ads/${adId}/stats`, { params: { from: date, to: date } })
          .then(res => ({
            date,
            views:  res.data.adStats.views,
            clicks: res.data.adStats.clicks,
            skips:  res.data.adStats.skips
          }))
      );
      const daily = await Promise.all(requests);
      setDailyData(daily);
      setRangeError(null);
    } catch {
      setRangeError('Error fetching data');
    }
  };
  
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
        <div style={{ height: '320px', marginTop: '30px' , marginBottom: '40px'}}>
          <h3>Daily Trend</h3>
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
              stroke: { curve: 'smooth', width: 2 },
              fill:   { opacity: 0.25 },
              xaxis:  { type: 'datetime' },
              tooltip:{ x: { format: 'yyyy-MM-dd' } },
              legend: { position: 'top' },
              grid:   { strokeDashArray: 3 },

              dataLabels: {
                enabled: true,
                formatter: (val) => (val === 0 ? '' : val),
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