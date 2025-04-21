import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaHourglassEnd } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Define API base URL with fallback and trailing slash handling
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const FormManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [forms, setForms] = useState({
    samuhLagan: { active: false, startTime: null, endTime: null, lastUpdated: null },
    studentAwards: { active: false, startTime: null, endTime: null, lastUpdated: null }
  });
  const [formData, setFormData] = useState({
    formName: 'samuhLagan',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchFormStatus();
      // Set up an interval to check form status every minute
      const intervalId = setInterval(fetchFormStatus, 60000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const fetchFormStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/admin/forms/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setForms(response.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching form status:', err);
      setError('Failed to fetch form status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');
      
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Validate date formats
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      if (endDate <= startDate) {
        throw new Error('End time must be after start time');
      }

      console.log('Sending request with data:', {
        formName: formData.formName,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/forms/set-form-timer`,
        {
          formName: formData.formName,
          startTime: formData.startTime,
          endTime: formData.endTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update the forms state with the new data
        const updatedForm = response.data[formData.formName];
        setForms(prev => ({
          ...prev,
          [formData.formName]: {
            active: true,
            startTime: updatedForm.startTime,
            endTime: updatedForm.endTime,
            lastUpdated: updatedForm.lastUpdated
          }
        }));
        setSuccess(`Successfully set timer for ${formData.formName === 'samuhLagan' ? 'Samuh Lagan' : 'Student Awards'} Registration Form`);
        setFormData({
          formName: 'samuhLagan',
          startTime: '',
          endTime: ''
        });
      }
    } catch (err) {
      console.error('Error setting form timer:', err);
      console.error('Error response:', err.response?.data);
      setError(
        err.response?.data?.message || 
        err.response?.data?.details || 
        err.message || 
        'Failed to set form timer. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const isTimerExpired = (form) => {
    if (!form.endTime) return false;
    
    const endDate = new Date(form.endTime);
    const now = new Date();
    
    return now > endDate;
  };

  const isTimerActive = (form) => {
    if (!form.startTime || !form.endTime) return false;
    
    const startDate = new Date(form.startTime);
    const endDate = new Date(form.endTime);
    const now = new Date();
    
    return now >= startDate && now <= endDate;
  };

  const getFormStatus = (form) => {
    if (!form.active) return { text: 'Inactive', color: 'text-red-500' };
    
    if (isTimerExpired(form)) {
      return { text: 'Timer Expired', color: 'text-orange-500' };
    }
    
    if (isTimerActive(form)) {
      return { text: 'Active', color: 'text-green-500' };
    }
    
    if (form.startTime && new Date(form.startTime) > new Date()) {
      return { text: 'Scheduled', color: 'text-blue-500' };
    }
    
    return { text: 'Active', color: 'text-green-500' };
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Form Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Samuh Lagan Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Samuh Lagan Registration Form</h2>
          <div className="flex items-center mb-4">
            <span className="text-gray-600 mr-2">Status:</span>
            <span className={`font-medium ${getFormStatus(forms.samuhLagan).color}`}>
              {getFormStatus(forms.samuhLagan).text}
            </span>
            {isTimerExpired(forms.samuhLagan) && (
              <FaHourglassEnd className="ml-2 text-orange-500" title="Timer has expired" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                Start Time: {formatDateTime(forms.samuhLagan.startTime)}
              </span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                End Time: {formatDateTime(forms.samuhLagan.endTime)}
              </span>
            </div>
          </div>
          
          {forms.samuhLagan.lastUpdated && (
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date(forms.samuhLagan.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Student Awards Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Student Awards Registration Form</h2>
          <div className="flex items-center mb-4">
            <span className="text-gray-600 mr-2">Status:</span>
            <span className={`font-medium ${getFormStatus(forms.studentAwards).color}`}>
              {getFormStatus(forms.studentAwards).text}
            </span>
            {isTimerExpired(forms.studentAwards) && (
              <FaHourglassEnd className="ml-2 text-orange-500" title="Timer has expired" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                Start Time: {formatDateTime(forms.studentAwards.startTime)}
              </span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                End Time: {formatDateTime(forms.studentAwards.endTime)}
              </span>
            </div>
          </div>
          
          {forms.studentAwards.lastUpdated && (
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date(forms.studentAwards.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Form Timer Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Set Form Timer</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Form Name
            </label>
            <select
              name="formName"
              value={formData.formName}
                  onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="samuhLagan">Samuh Lagan Registration Form</option>
              <option value="studentAwards">Student Awards Registration Form</option>
            </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
              value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
              value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">
              Setting a timer will automatically activate the form. The form will only be visible during the specified time period.
            </span>
            </div>
            
              <button
            type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
            {loading ? 'Setting Timer...' : 'Set Timer'}
              </button>
        </form>
        </div>
    </div>
  );
};

export default FormManagement; 