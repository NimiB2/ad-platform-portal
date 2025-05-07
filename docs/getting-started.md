---
layout: default
title: Getting Started
nav_order: 2
---
# Getting Started with Ad Portal

This guide provides instructions for setting up and running the Ad Portal.

## Prerequisites

- Node.js
- npm
- Git (for cloning the repository)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nimib2/Ad-Portal.git
cd Ad-Portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root with:

```
REACT_APP_API_URL=https://ad-server-kappa.vercel.app
```

For local backend development, you can point to your local Flask server:

```
REACT_APP_API_URL=http://localhost:1993
```

### 4. Start the Development Server

```bash
npm start
```

This will launch the application on `http://localhost:3000`.

## Production Deployment

### Vercel Deployment

1. Configure the Vercel project by creating a `vercel.json` file:
   ```json
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://ad-server-kappa.vercel.app/:path*" }
     ]
   }
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

## User Accounts

The portal supports two types of users:
- **Advertisers**: Regular users who can manage their own ads
- **Developers**: Admin users who can view statistics across all advertisers

### First Login

When you first visit the portal, you'll be presented with a login screen with options for both regular and developer login.

For testing purposes, you can use:
- Regular login: any email (will create a new account if it doesn't exist)
- Developer login: "developer@example.com"

## docs/user-guide.md

---
layout: default
title: User Guide
nav_order: 3
---
# User Guide

This guide explains how to use the Ad Portal as both an advertiser and a developer.

## Advertiser Interface

### Dashboard

The dashboard displays your current ads and their performance metrics. From here you can:
- Create new ads
- Edit existing ads
- Delete ads
- View statistics for individual ads

### Creating an Ad

1. Click the "New Ad" button
2. Fill in the required fields:
   - Ad Name: A descriptive name for your campaign
   - Video URL: Direct link to the video asset (MP4 format)
   - Target URL: Where users will go when clicking the ad
   - Budget: Choose from low, medium, or high
   - Skip Time: When the skip button appears (seconds)
   - Exit Time: When the exit button appears (seconds)
3. Click "Create" to save your ad

### Viewing Ad Statistics

1. Click "View Stats" on any ad card
2. The statistics page shows:
   - Total views, clicks, and skips
   - Click-through rate
   - Average watch duration
   - Performance over time (with date filtering)

### Editing or Deleting Ads

- Click "Edit" on an ad card to modify its properties
- Click "Delete" to remove an ad (requires confirmation)

## Developer Interface

### Developer Login

1. Click "Login as Developer" on the login screen
2. Enter a developer email address

### All Advertisers View

The developer dashboard shows:
- All advertisers in the system
- All ads grouped by advertiser
- System-wide statistics

### Comprehensive Analytics

The "View All Stats" button provides:
- Aggregated statistics across all advertisers
- Per-advertiser breakdowns
- Daily trends for system-wide metrics
- Filtering by date ranges

## docs/api-integration.md

---
layout: default
title: API Integration
nav_order: 4
---
# API Integration

This document explains how the Ad Portal integrates with the Flask Ad Server backend.

## API Communication

The portal uses Axios for API requests to the Flask backend. All API functions are centralized in the `src/api.js` file.

### Authentication

The portal implements email-based authentication:
- Regular users are identified by their email address
- A performer record is created in the backend when a new user registers
- Session information is stored in localStorage

```javascript
// Login function in api.js
export const loginUser = async (email) => {
  try {
    const response = await axios.post('/api/performers', { 
      name: 'Existing User',
      email: email 
    });
    
    if (response.status === 200) {
      localStorage.setItem('currentUser', email);
      localStorage.setItem('performerId', response.data.performerId);
      localStorage.removeItem('isDeveloper');
      localStorage.removeItem('developerId');
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
```

### Ad Management

The portal implements CRUD operations for ads:

```javascript
// Create Ad
export const createAd = async (adData) => {
  try {
    const response = await axios.post('/api/ads', adData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Ads
export const getAds = async (getAll = false) => {
  try {
    const response = await axios.get('/api/ads');
    const allAds = response.data;
    
    if (getAll) return allAds;
    
    const performerId = localStorage.getItem('performerId');
    return allAds.filter(ad => ad.performerId === performerId);
  } catch (error) {
    throw error;
  }
};
```

### Statistics Retrieval

The portal fetches statistics from the backend:

```javascript
// Get Ad Statistics
export const getAdStats = async (id) => {
  try {
    const response = await axios.get(`/api/ads/${id}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Performer Statistics
export const getPerformerStats = async () => {
  try {
    const performerId = localStorage.getItem('performerId');
    const response = await axios.get(`/api/performers/${performerId}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

## API Proxy Configuration

For local development, the portal uses Vercel proxy configuration to avoid CORS issues:

```json
// vercel.json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://ad-server-kappa.vercel.app/:path*" }
  ]
}
```

## Error Handling

API requests include error handling to provide feedback to users:

```javascript
try {
  // API call
} catch (err) {
  setError(err.response?.data?.error || 'Operation failed');
} finally {
  setLoading(false);
}
```

## docs/analytics.md

---
layout: default
title: Analytics
nav_order: 5
---
# Analytics

This document explains the analytics capabilities of the Ad Portal and how to interpret the visualizations.

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
    // Fetch data for the selected date range
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

```javascript
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
```

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
