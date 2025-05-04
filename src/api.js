import axios from 'axios';

// User authentication
export const loginUser = async (email) => {
  try {
    const response = await axios.post('/api/performers', { 
      name: 'Existing User',
      email: email 
    });
    
    if (response.status === 200) {
      localStorage.setItem('currentUser', email);
      localStorage.setItem('performerId', response.data.performerId);
      return response.data;
    } else {
      // If we somehow get a different success status, throw an error
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (name, email) => {
  try {
    const response = await axios.post('/api/performers', { name, email });
    localStorage.setItem('currentUser', email);
    localStorage.setItem('performerId', response.data.performerId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('performerId');
};

export const getCurrentUser = () => {
  return localStorage.getItem('currentUser');
};

export const getPerformerId = () => {
  return localStorage.getItem('performerId');
};

// Ad management
export const getAds = async () => {
  try {
    // Get all ads from the server
    const response = await axios.get('/api/ads');
    const allAds = response.data;
    
    // Get the current user's ID
    const performerId = localStorage.getItem('performerId');
    
    // Return only ads belonging to this user
    return allAds.filter(ad => ad.performerId === performerId);
  } catch (error) {
    throw error;
  }
};

export const getAdById = async (id) => {
  try {
    const response = await axios.get(`/api/ads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAd = async (adData) => {
  try {
    const response = await axios.post('/api/ads', adData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAd = async (id, adData) => {
  try {
    const response = await axios.put(`/api/ads/${id}`, adData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAd = async (id) => {
  try {
    const response = await axios.delete(`/api/ads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Statistics
export const getAdStats = async (id) => {
  try {
    const response = await axios.get(`/api/ads/${id}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};