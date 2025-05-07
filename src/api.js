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
      // Ensure we clear any developer flags
      localStorage.removeItem('isDeveloper');
      localStorage.removeItem('developerId');
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const loginDeveloper = async (email) => {
  try {
    const response = await axios.post('/api/developers/login', { email });
    if (response.data.exists) {
      localStorage.setItem('currentUser', email);
      localStorage.setItem('isDeveloper', 'true');
      localStorage.setItem('developerId', response.data.developerId);
      return response.data;
    } else {
      throw new Error('Developer not found');
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
    // Ensure we clear any developer flags
    localStorage.removeItem('isDeveloper');
    localStorage.removeItem('developerId');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('performerId');
  localStorage.removeItem('isDeveloper');
  localStorage.removeItem('developerId');
};

export const getCurrentUser = () => {
  return localStorage.getItem('currentUser');
};

export const getPerformerId = () => {
  return localStorage.getItem('performerId');
};

export const isDeveloper = () => {
  return localStorage.getItem('isDeveloper') === 'true';
};

export const getDeveloperId = () => {
  return localStorage.getItem('developerId');
};

// Ad management
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

// Get ad by id
export const getAdById = async (id) => {
  try {
    const response = await axios.get(`/api/ads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Ad Create Ad
export const createAd = async (adData) => {
  try {
    const response = await axios.post('/api/ads', adData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Ad Update Ad
export const updateAd = async (id, adData) => {
  try {
    const response = await axios.put(`/api/ads/${id}`, adData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Ad Delete Ad
export const deleteAd = async (id) => {
  try {
    const response = await axios.delete(`/api/ads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Ad Statistics
export const getAdStats = async (id) => {
  try {
    const response = await axios.get(`/api/ads/${id}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Performer Statistics
export const getPerformerStats = async () => {
  try {
    const performerId = localStorage.getItem('performerId');
    const response = await axios.get(`/api/performers/${performerId}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all performers (admin only)
export const getAllPerformers = async () => {
  try {
    const response = await axios.get('/api/performers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all performers Statistics
export const getAllPerformersStats = async () => {
  try {
    const performers = await getAllPerformers();
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
    return Promise.all(statsPromises);
  } catch (error) {
    throw error;
  }
};