import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { FaCalendarAlt, FaUserFriends, FaClock, FaEnvelope, FaPhone, FaUser, FaCheckCircle } from 'react-icons/fa';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:3000';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Booking() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    startTime: '',
    endTime: '',
    additionalNotes: '',
    eventDocument: '',
    documentType: 'Other'
  });
  const [bookedEvents, setBookedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Check if there's a stored booking date from previous session
    const storedDate = localStorage.getItem('selectedBookingDate');
    if (storedDate && token) {
      setSelectedDate(new Date(storedDate));
      setShowForm(true);
      localStorage.removeItem('selectedBookingDate');
    }
    
    fetchBookings();
    setIsLoading(false);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      const bookingsData = Array.isArray(response.data) ? response.data : [];
      setBookedEvents(bookingsData.map(booking => ({
        title: booking.status,
        start: new Date(booking.date),
        end: new Date(booking.date),
        allDay: true,
        status: booking.status
      })));
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again later.');
    }
  };

  const isDateBooked = (date) => {
    return bookedEvents.some(event => 
      format(date, 'yyyy-MM-dd') === format(event.start, 'yyyy-MM-dd') && event.status === 'Booked'
    );
  };

  const handleDateSelect = (slotInfo) => {
    const selectedDate = new Date(slotInfo.start);
    if (isDateBooked(selectedDate)) {
      alert('This date is already booked. Please select another date.');
      return;
    }
    
    // Check if user is logged in
    if (!isAuthenticated) {
      // Store the selected date in localStorage to restore it after login
      localStorage.setItem('selectedBookingDate', selectedDate.toISOString());
      // Store the current URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', '/booking');
      // Redirect to login page
      navigate('/auth');
      return;
    }
    
    setSelectedDate(selectedDate);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formattedDate = selectedDate.toISOString();
      
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventType: formData.eventType,
        date: formattedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        guestCount: parseInt(formData.guestCount),
        additionalNotes: formData.additionalNotes,
        eventDocument: formData.eventDocument,
        status: 'Pending'
      };

      const response = await axios.post('/api/bookings/submit', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setShowSuccessPopup(true);
        setShowForm(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          guestCount: '',
          startTime: '',
          endTime: '',
          additionalNotes: '',
          eventDocument: '',
          documentType: 'Other'
        });
        fetchBookings();
        
        // Hide the success popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      if (error.response?.status === 401) {
        navigate('/auth');
      } else {
        alert(`Error submitting booking request: ${error.response?.data?.message || 'Please try again'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('document', file);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.post('/api/bookings/upload-document', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        
        setFormData(prev => ({
          ...prev,
          eventDocument: response.data.documentUrl,
          documentType: response.data.documentType
        }));
      } catch (error) {
        console.error('Error uploading document:', error);
        if (error.response?.status === 401) {
          navigate('/auth');
        } else {
          alert('Failed to upload document');
        }
      }
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = 'transparent'; // Default to transparent for rejected events
    if (event.status === 'Pending') {
      backgroundColor = '#fbbf24'; // Yellow for pending
    } else if (event.status === 'Booked') {
      backgroundColor = '#ef4444'; // Red for booked
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white', // Make text visible
        border: '0',
        display: 'block'
      }
    };
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking page...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your booking request has been submitted successfully. We'll review it and get back to you shortly.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
          alt="Venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Event</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Select your preferred date and let us help you create an unforgettable event
            </p>
            
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Calendar Legend */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Calendar Legend</h3>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-[#fbbf24] mr-2"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-[#ef4444] mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <Calendar
                localizer={localizer}
                events={bookedEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectSlot={handleDateSelect}
                selectable
                eventPropGetter={eventStyleGetter}
                views={['month']}
              />
            </div>
          </div>

          {/* Booking Form Section */}
          <div className="lg:col-span-1">
            {showForm ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Book for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Event Type</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="social">Social Gathering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserFriends className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaClock className="text-gray-400" />
                        </div>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaClock className="text-gray-400" />
                        </div>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Document
                    </label>
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-2">
                        Please upload one of the following documents:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc pl-5 mb-3">
                        <li>Government-issued ID (Aadhar Card, PAN Card, or Passport)</li>
                        <li>Event invitation or announcement</li>
                        <li>Organization letterhead (for corporate events)</li>
                        <li>Birth certificate (for birthday parties)</li>
                        <li>Marriage certificate (for weddings)</li>
                      </ul>
                      <p className="text-sm text-gray-600 mb-2">
                        Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg text-white transition-colors ${
                      isSubmitting 
                        ? 'bg-purple-400 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit Booking Request'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <FaCalendarAlt className="text-6xl text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select a Date
                  </h2>
                  <p className="text-gray-600">
                    Click on your preferred date in the calendar to start your booking
                  </p>
                  {!isAuthenticated && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-700 text-sm">
                        You need to login to book an event. Click on a date to be redirected to the login page.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;