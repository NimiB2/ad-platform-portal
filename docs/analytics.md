---
layout: default
title: Analytics
nav_order: 5
---
# Analytics

This section explains the analytics capabilities of the Ad Portal and how to interpret the visualizations.

## Analytics Components

The portal uses ApexCharts to visualize ad performance data through two main components:

1. `AdStats.js` - Statistics for individual ads
2. `AllAdStats.js` - System-wide and advertiser-level statistics

## Individual Ad Statistics

When viewing statistics for a single ad, the portal shows:

### Key Metrics

- **Views**: Total number of times the ad was watched
- **Clicks**: Number of clicks on the ad
- **Click-Through Rate (CTR)**: Percentage of views that resulted in clicks
- **Average Watch Duration**: Average time users spent watching the ad

### Performance Visualization

The ad statistics page includes:

1. **Metrics Cards**: Summary cards showing the key performance indicators
2. **Bar Charts**: Visual representation of event counts and rates
3. **Time Series Chart**: Shows views, clicks, and skips over time when date filtering is enabled

## Filtering by Date

Users can filter statistics by date range:

```javascript
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
```

## System-Wide Analytics

Developer users can view system-wide analytics including:

### Aggregated Statistics

- Total views, clicks, and skips across all ads
- System-wide CTR
- Average watch duration

### Per-Advertiser Breakdown

- Individual performance metrics for each advertiser
- Comparison between advertisers

### Daily Trends

The system displays daily performance trends as time series charts that show:
- Views over time
- Clicks over time
- Skips over time

## Data Visualization

The portal uses ApexCharts to create interactive visualizations:

{% raw %}
```javascript
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
    markers: { size: 4, strokeWidth: 0 },
    fill:   { opacity: 0.25 },
    xaxis:  { type: 'datetime' },
    tooltip:{ x: { format: 'yyyy-MM-dd' } },
    legend: { position: 'top' },
    grid:   { strokeDashArray: 3, borderColor: '#9e9e9e' }
  }}
/>
```
{% endraw %}


## Interpreting the Data

The analytics provide insights for both advertisers and developers:

### For Advertisers

- **High CTR**: Indicates effective ad content and targeting
- **Long Watch Duration**: Shows engaging video content
- **Low Skip Rate**: Suggests content relevance

### For Developers

- **System Health**: Overall usage patterns
- **Advertiser Comparison**: Relative performance of different advertisers
- **Trend Analysis**: Usage patterns over time
```
