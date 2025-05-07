---
layout: default
title: API Integration
nav_order: 4
---
# API Integration

This section explains how the Ad Portal integrates with the Flask Ad Server backend.

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
    // Use the performers endpoint to check if user exists
    const response = await axios.post('/api/performers', { 
      name: 'Existing User', // Name doesn't matter for lookup
      email: email 
    });
    
    // If response is 200, user exists
    if (response.status === 200) {
      // Store user email and ID in local storage
      localStorage.setItem('currentUser', email);
      localStorage.setItem('performerId', response.data.performerId);
      // Ensure we clear any developer flags
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
    // Get all ads from the server
    const response = await axios.get('/api/ads');
    const allAds = response.data;
    
    // If getAll flag is true, return all ads (for admin)
    if (getAll) return allAds;
    
    // Get the current user's ID
    const performerId = localStorage.getItem('performerId');
    
    // Return only ads belonging to this user
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
```
