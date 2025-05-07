import React, { useState, useEffect } from 'react';
import { getPerformerStats, getAllPerformers, isDeveloper } from '../api';
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
  // Use the isDeveloper function from api.js instead of checking specific email
  const isDevUser = isDeveloper();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dailyData, setDailyData] = useState(null);
  const [rangeError, setRangeError] = useState(null);

  const handleToggleGraph = async () => {
    if (dailyData) {
      setDailyData(null); // hide if already showing
      return;
    }
    
    if (!fromDate || !toDate) {
      setRangeError('Please choose a valid date range');
      return;
    }
    
    try {
      setLoading(true);
      const requests = [];
      let d = new Date(fromDate);
      const end = new Date(toDate);
      
      // Create a request for each day in the range
      while (d <= end) {
        const dateStr = d.toISOString().slice(0, 10);
        
        if (!isDevUser) {
          // For regular user - fetch daily stats for each of their ads and then aggregate
          const adRequests = stats.adsStats.map(adStat => 
            axios.get(`/api/ads/${adStat.adId}/stats`, { params: { from: dateStr, to: dateStr } })
              .then(res => ({
                date: dateStr,
                views: res.data.adStats.views,
                clicks: res.data.adStats.clicks,
                skips: res.data.adStats.skips,
              }))
              .catch(() => ({
                date: dateStr,
                views: 0,
                clicks: 0,
                skips: 0
              }))
          );
          
          requests.push(Promise.all(adRequests).then(adDailyStats => {
            // Aggregate the stats for all ads on this day
            return {
              date: dateStr,
              views: adDailyStats.reduce((sum, stat) => sum + stat.views, 0),
              clicks: adDailyStats.reduce((sum, stat) => sum + stat.clicks, 0),
              skips: adDailyStats.reduce((sum, stat) => sum + stat.skips, 0)
            };
          }));
        } else {
          // For developer - aggregate stats across all performers for each day
          const performerRequests = allPerformerStats.map(performer => {
            // For each performer, fetch stats for all their ads on this day
            const adRequests = (performer.stats.adsStats || []).map(adStat => 
              axios.get(`/api/ads/${adStat.adId}/stats`, { params: { from: dateStr, to: dateStr } })
                .then(res => ({
                  date: dateStr,
                  views: res.data.adStats.views,
                  clicks: res.data.adStats.clicks,
                  skips: res.data.adStats.skips,
                }))
                .catch(() => ({
                  date: dateStr,
                  views: 0,
                  clicks: 0,
                  skips: 0
                }))
            );
            
            return Promise.all(adRequests).then(adDailyStats => {
              // Aggregate the stats for all ads of this performer on this day
              return {
                performerId: performer.performerId,
                performerName: performer.performerName,
                date: dateStr,
                views: adDailyStats.reduce((sum, stat) => sum + stat.views, 0),
                clicks: adDailyStats.reduce((sum, stat) => sum + stat.clicks, 0),
                skips: adDailyStats.reduce((sum, stat) => sum + stat.skips, 0)
              };
            });
          });
          
          // Wait for all performer data for this day, then aggregate
          requests.push(Promise.all(performerRequests).then(performerDailyStats => {
            return {
              date: dateStr,
              views: performerDailyStats.reduce((sum, stat) => sum + stat.views, 0),
              clicks: performerDailyStats.reduce((sum, stat) => sum + stat.clicks, 0),
              skips: performerDailyStats.reduce((sum, stat) => sum + stat.skips, 0),
              // Store performer breakdown for potential future use
              performers: performerDailyStats
            };
          }));
        }
        
        // Move to next day
        d.setDate(d.getDate() + 1);
      }
      
      const dailyResults = await Promise.all(requests);
      setDailyData(dailyResults);
      setRangeError(null);
    } catch (error) {
      console.error('Error fetching daily data:', error);
      setRangeError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isDevUser) {
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
  }, [isDevUser]);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
  // For regular user
  if (!isDevUser) {
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
          <h3>Daily Trend</h3>
          <Chart
            type="area"
            height={300}
            series={[
              { name: 'Views',  data: dailyData.map(d => [d.date, d.views]) },
              { name: 'Clicks', data: dailyData.map(d => [d.date, d.clicks]) },
              { name: 'Skips',  data: dailyData.map(d => [d.date, d.skips]) },
            ]}
            options={{
              colors: ['#2196F3', '#4CAF50', '#FF9800'],
              stroke: { curve: 'smooth', width: 0 },
              markers: { size: 4, strokeWidth: 0 },
              fill: { opacity: 0.25 },
              xaxis: { type: 'datetime' },
              tooltip: { x: { format: 'yyyy-MM-dd' } },
              legend: { position: 'top' },
              grid: { strokeDashArray: 3, borderColor: '#9e9e9e' },
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