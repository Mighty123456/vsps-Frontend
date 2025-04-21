import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createFormNotification = async (formType, message) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_URL}/api/notifications`,
      {
        type: 'form',
        formType,
        message,
        read: false
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Fetching notifications from:', `${API_URL}/api/notifications`);
    
    const response = await axios.get(`${API_URL}/api/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Notifications API response:', response.data);

    if (!response.data) {
      throw new Error('Invalid response format from notifications API');
    }

    // Handle both array and object with notifications property
    const notifications = Array.isArray(response.data) 
      ? response.data 
      : response.data.notifications || [];

    if (!Array.isArray(notifications)) {
      throw new Error('Notifications data is not an array');
    }

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }
    throw error;
  }
}; 