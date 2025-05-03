import axios from 'axios';

// Change this to your actual API URL
const API_URL = 'https://ad-server-kappa.vercel.app/';

// User management
export const loginUser = (email) => {
  localStorage.setItem('userEmail', email);
  return email;
};

export const logoutUser = () => {
  localStorage.removeItem('userEmail');
};

export const getCurrentUser = () => {
  return localStorage.getItem('userEmail');
};

export const registerUser = async (name, email) => {
  const response = await axios.post(`${API_URL}performers`, { name, email });
  return response.data;
};

// Ad management
export const getAds = async () => {
  const response = await axios.get(`${API_URL}ads`);
  return response.data;
};

export const getAdById = async (id) => {
  const response = await axios.get(`${API_URL}ads/${id}`);
  return response.data;
};

export const createAd = async (adData) => {
  const response = await axios.post(`${API_URL}ads`, adData);
  return response.data;
};

export const updateAd = async (id, adData) => {
  const response = await axios.put(`${API_URL}ads/${id}`, adData);
  return response.data;
};

export const deleteAd = async (id) => {
  const response = await axios.delete(`${API_URL}ads/${id}`);
  return response.data;
};

// Statistics
export const getAdStats = async (id) => {
  const response = await axios.get(`${API_URL}ads/${id}/stats`);
  return response.data;
};