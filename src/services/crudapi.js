import axios from 'axios';

// Check your API_BASE_URL - it should NOT include /api/content
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for API calls
const apiRequest = async (method, endpoint, data = null, params = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      params,
      data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Home Content
export const getHomeContent = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/content/home`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch home content: ${error.message}`);
  }
};

export const updateHomeContent = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/content/home/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update home content: ${error.message}`);
  }
};

export const addSlide = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/content/home/slides`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add slide: ${error.message}`);
  }
};

export const updateSlide = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/content/home/slides/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update slide: ${error.message}`);
  }
};

export const deleteSlide = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/content/home/slides/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete slide: ${error.message}`);
  }
};

// Event Categories
export const getEventCategories = () => apiRequest('get', '/event-categories');
export const createEventCategory = (formData) => {
  return axios.post(`${API_BASE_URL}/event-categories`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateEventCategory = (id, formData) => {
  return axios.put(`${API_BASE_URL}/event-categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteEventCategory = (id) => apiRequest('delete', `/event-categories/${id}`);

// Gallery
export const getGalleryItems = async (type) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/content/gallery${type ? `?type=${type}` : ''}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch gallery items: ${error.message}`);
  }
};

export const createGalleryItem = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/content/gallery`, formData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create gallery item: ${error.message}`);
  }
};

export const updateGalleryItem = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/content/gallery/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update gallery item: ${error.message}`);
  }
};

export const deleteGalleryItem = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/content/gallery/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete gallery item: ${error.message}`);
  }
};