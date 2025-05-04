// src/api.js
import axios from 'axios';

// User authentication
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.post('/api/performers/check-email', { email });
    return response.data.exists;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

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
      return response.data;
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