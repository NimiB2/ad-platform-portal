---
layout: default
title: Installation
nav_order: 10
---
# Installation Guide

This guide explains how to install and set up the Ad Portal for development or production use.

## Prerequisites

Before installing the Ad Portal, you need:

- Node.js installed on your system
- Access to the command line/terminal

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/nimib2/Ad-Portal.git
cd Ad-Portal
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React
- Axios
- ApexCharts

### 3. Configure Environment

Create a `.env` file in the project root directory with the API URL:

```
REACT_APP_API_URL=https://ad-server-kappa.vercel.app
```

### 4. Run Development Server

```bash
npm start
```

This will start the development server at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The optimized production build will be created in the `build` directory.

## Vercel Configuration

The project includes a `vercel.json` file that sets up API proxying:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://ad-server-kappa.vercel.app/:path*" }
  ]
}
```

## Connecting Components

The Ad Portal consists of several React components that work together:

```
App.js (Main container)
├── Auth.js (Authentication)
├── Dashboard.js (Main view)
│   └── AdminView.js (Developer view)
├── AdForm.js (Create/edit ads)
├── AdStats.js (Single ad statistics)
└── AllAdStats.js (System-wide statistics)
```

## docs/ecosystem.md

---
layout: default
title: AdSDK Ecosystem
nav_order: 11
---
# AdSDK Ecosystem

The Ad Portal is part of a larger ecosystem of components that work together to provide end-to-end ad management and delivery.

## Components Overview

The AdSDK ecosystem consists of three main components:

1. **[Ad Portal](https://nimib2.github.io/Ad-Portal/)** (This project)
   - Web interface for advertisers and developers
   - Ad management and analytics

2. **[Flask Ad Server](https://nimib2.github.io/Ad-Server/)**
   - Backend for data storage and processing
   - RESTful API endpoints
   - MongoDB database integration

3. **[Android SDK](https://nimib2.github.io/Android-SDK-Ads/)**
   - Client library for Android apps
   - Ad display and interaction
   - Performance tracking

## Data Flow

The AdSDK system has the following data flow:

1. **Ad Creation**: Advertisers create ads in the Ad Portal
2. **Data Storage**: Ad data is stored in the Flask Ad Server's MongoDB database
3. **Ad Delivery**: Android apps request ads from the Flask Ad Server
4. **Performance Tracking**: Ad views, clicks, and skips are sent from the Android SDK to the Flask Ad Server
5. **Analytics**: The Ad Portal displays performance statistics fetched from the Flask Ad Server

## Integration Points

### Ad Portal to Flask Ad Server

The Ad Portal communicates with the Flask Ad Server via REST API:

```javascript
// Example API call from src/api.js
export const getAds = async (getAll = false) => {
  try {
    const response = await axios.get('/api/ads');
    // Process and filter response data
    return filteredAds;
  } catch (error) {
    throw error;
  }
};
```

### Android SDK to Flask Ad Server

The Android SDK communicates with the same Flask Ad Server APIs:

```java
// From AdController.java in Android SDK
public void initRandomAd(String packageName, AdCallback adCallback) {
    try {
        AdApiService apiService = getApiService();
        Call<Ad> call = apiService.loadRandomAd(packageName);
        // Process response
    } catch (Exception e) {
        // Handle errors
    }
}
```

## Documentation Links

For more detailed information on each component:

- **[Ad Portal Documentation](https://nimib2.github.io/Ad-Portal/)** - This documentation
- **[Flask Ad Server Documentation](https://nimib2.github.io/Ad-Server/)** - Backend APIs and data structures
- **[Android SDK Documentation](https://nimib2.github.io/Android-SDK-Ads/)** - Client implementation and integration
