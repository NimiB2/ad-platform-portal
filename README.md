# Ad Portal – Campaign Management Dashboard

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)
![Node](https://img.shields.io/badge/node-16%2B-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

A professional React-based web dashboard for managing video advertisement campaigns and analyzing performance metrics within the AdSDK ecosystem.

## 📚 Documentation & Demo

- **[📖 Complete Documentation](https://nimib2.github.io/video-ad-portal/)** - User guides, API integration, and examples
- **[🎥 Watch Full System Demo](https://NimiB2.github.io/video-ad-server/demo.html)** - See the complete ad management system in action

---

## 🚀 Quick Start

### Installation

1. **Clone and setup**:
```bash
git clone [your-repo-url]
cd ad-portal
npm install
```

2. **Configure environment**:
Create `.env` file:
```env
REACT_APP_API_URL=https://ad-server-kappa.vercel.app
```

3. **Start development server**:
```bash
npm start
```
Portal available at `http://localhost:3000`

4. **Build for production**:
```bash
npm run build
```

5. **Deploy to Vercel**:
```bash
vercel
```

---

## 🔧 Core Features

| Feature | Description |
|---------|-------------|
| **Campaign Management** | Create, edit, and delete video ad campaigns |
| **Performance Analytics** | Real-time metrics with interactive visualizations |
| **User Authentication** | Email-based advertiser and developer access |
| **Interactive Charts** | ApexCharts integration with date filtering |
| **Responsive Design** | Optimized for desktop and mobile devices |
| **Real-time Data** | Live connection to Flask backend API |

### Technical Specifications

- **Framework**: React 19.1.0 with modern hooks
- **Visualization**: ApexCharts 4.7.0 for interactive charts
- **HTTP Client**: Axios 1.9.0 for API communication
- **Build System**: Create React App with React Scripts 5.0.1
- **Deployment**: Vercel-ready with proxy configuration

---

## 📋 User Interface Components

### Core Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `Auth.js` | User authentication | Email login, developer access |
| `Dashboard.js` | Main advertiser interface | Campaign overview, management |
| `AdForm.js` | Campaign creation/editing | Video URLs, targeting, timing |
| `AdStats.js` | Individual ad analytics | Performance metrics, charts |
| `AllAdStats.js` | System-wide statistics | Aggregate analytics, trends |
| `AdminView.js` | Developer system overview | All advertisers, system health |

### User Access Levels

**Advertiser Interface:**
- Campaign creation and management
- Individual ad performance tracking
- Interactive analytics with date filtering
- Revenue and engagement metrics

**Developer/Admin Interface:**
- System-wide performance monitoring
- All advertiser campaign overview
- Aggregate analytics and trends
- User management capabilities

---

## 💡 Implementation Examples

### Campaign Creation

```javascript
// AdForm.js - Creating a new campaign
const handleSubmit = async (e) => {
  e.preventDefault();
  const campaignData = {
    adName: "Summer Sale 2025",
    performerEmail: getCurrentUser(),
    adDetails: {
      videoUrl: "https://example.com/video.mp4",
      targetUrl: "https://example.com/landing",
      budget: "medium",
      skipTime: 5,
      exitTime: 30
    }
  };
  
  await createAd(campaignData);
  onSave();
};
```

### Analytics Visualization

```javascript
// AdStats.js - Interactive chart configuration
<Chart
  type="area"
  height={300}
  series={[
    { name: 'Views',  data: dailyData.map(d => [d.date, d.views]) },
    { name: 'Clicks', data: dailyData.map(d => [d.date, d.clicks]) },
    { name: 'Skips',  data: dailyData.map(d => [d.date, d.skips]) }
  ]}
  options={{
    colors: ['#2196F3', '#4CAF50', '#FF9800'],
    stroke: { curve: 'smooth', width: 0 },
    xaxis: { type: 'datetime' },
    tooltip: { x: { format: 'yyyy-MM-dd' } }
  }}
/>
```

### API Integration

```javascript
// api.js - Backend communication
export const createAd = async (adData) => {
  const response = await axios.post('/api/ads', adData);
  return response.data;
};

export const getAdStats = async (id) => {
  const response = await axios.get(`/api/ads/${id}/stats`);
  return response.data;
};
```

---

## 🏗️ Architecture

### Application Structure

```
src/
├── components/
│   ├── Auth.js (Authentication)
│   ├── Dashboard.js (Main Interface)
│   ├── AdForm.js (Campaign Management)
│   ├── AdStats.js (Individual Analytics)
│   ├── AllAdStats.js (System Analytics)
│   └── AdminView.js (Developer Interface)
├── api.js (Backend Integration)
├── App.js (Main Application)
└── index.js (Entry Point)
```

### Data Flow
1. **Authentication** → Email-based user identification
2. **Campaign Management** → CRUD operations via Flask API
3. **Analytics** → Real-time data visualization
4. **State Management** → React hooks for local state

---

## 🔗 Integration with Ecosystem

The Ad Portal integrates with:

- **[Flask Ad Server](https://nimib2.github.io/video-ad-server/)** - Backend API for data management
- **[Android SDK](https://nimib2.github.io/video-ad-sdk-android/)** - Mobile ad delivery tracking
- **ApexCharts** - Interactive data visualization library

### API Proxy Configuration

```json
// vercel.json - Production API routing
{
  "rewrites": [
    { 
      "source": "/api/:path*", 
      "destination": "https://ad-server-kappa.vercel.app/:path*" 
    }
  ]
}
```

---

## 📊 Analytics Features

### Performance Metrics

- **View Counts** - Total ad impressions
- **Click-Through Rates** - Engagement percentages
- **Skip Rates** - User interaction patterns
- **Watch Duration** - Average viewing time
- **Conversion Rates** - Budget-weighted performance

### Visualization Capabilities

- **Time Series Charts** - Daily performance trends
- **Interactive Filtering** - Custom date ranges
- **Comparative Analytics** - Multi-advertiser insights
- **Real-time Updates** - Live data synchronization

---

## 📖 Additional Resources

- **[User Guide](https://nimib2.github.io/video-ad-portal/user-guide.html)** - Complete interface walkthrough
- **[API Integration](https://nimib2.github.io/video-ad-portal/api-integration.html)** - Backend connection details
- **[Analytics Guide](https://nimib2.github.io/video-ad-portal/analytics.html)** - Understanding charts and metrics
- **[Getting Started](https://nimib2.github.io/video-ad-portal/getting-started.html)** - Setup and configuration

---

## ✨ What's New

### Current Version
- **React 19 Upgrade** - Latest React features and performance improvements
- **Enhanced Charts** - ApexCharts 4.7.0 with improved interactivity
- **Date Filtering** - Advanced analytics with custom time ranges
- **Mobile Optimization** - Responsive design for all device sizes
- **Developer Dashboard** - Comprehensive system-wide analytics
- **Real-time Sync** - Live data updates from backend API

---

## 📄 License

**This is an educational study project created for learning purposes only.**
Demo content and advertisements are used for demonstration and are not intended for commercial use.

```
MIT License

Copyright (c) 2025 Nimrod Bar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```
