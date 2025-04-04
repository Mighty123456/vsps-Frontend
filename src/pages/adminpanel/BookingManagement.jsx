import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon, PencilIcon, DocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:3000';

const Notification = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`rounded-lg p-4 shadow-lg ${bgColor} border ${borderColor}`}>
        <div className="flex items-center">
          {type === 'success' ? (
            <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
          ) : (
            <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
          )}
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

const RejectionModal = ({ onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Rejection Reason</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows="4"
          placeholder="Please provide a reason for rejection..."
        />
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (reason.trim()) {
                onSubmit(reason);
                onClose();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentViewer = ({ documentUrl, documentType, onClose }) => {
  // Determine file type from URL
  const fileExtension = documentUrl.split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
  const isPdf = fileExtension === 'pdf';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">{documentType} Viewer</h3>
          <div className="flex space-x-2">
            <a 
              href={documentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {isImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <img 
                src={documentUrl} 
                alt={documentType} 
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={`${documentUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-[80vh] border-0"
              title={`${documentType} PDF`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <p className="text-gray-500 mb-4">This file type cannot be previewed directly.</p>
              <a 
                href={documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Open {documentType}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionBookingId, setRejectionBookingId] = useState(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('Document');

  useEffect(() => {
    fetchBookings();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings');
      // Handle the response data directly since we modified the controller
      setBookings(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`/api/bookings/approve/${id}`);

      if (response.data) {
        showNotification('Booking approved successfully');
        await fetchBookings();
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      showNotification(error.response?.data?.message || 'Failed to approve booking', 'error');
    }
  };

  const handleReject = async (id) => {
    setRejectionBookingId(id);
    setShowRejectionModal(true);
  };

  const handleRejectionSubmit = async (reason) => {
    try {
      await axios.put(`/api/bookings/reject/${rejectionBookingId}`, { 
        bookingId: rejectionBookingId, 
        rejectionReason: reason 
      });
      showNotification('Booking rejected successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      showNotification('Failed to reject booking', 'error');
    }
  };

  const handleConfirmPayment = async (id) => {
    try {
      await axios.put(`/api/bookings/confirm-payment/${id}`, {
        bookingId: id
      });
      showNotification('Payment confirmed successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error confirming payment:', error);
      showNotification('Failed to confirm payment', 'error');
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      const response = await axios.put(`/api/bookings/confirm-booking/${id}`);

      if (response.data) {
        showNotification('Booking confirmed successfully');
        await fetchBookings();
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      showNotification(error.response?.data?.message || 'Failed to confirm booking', 'error');
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedData({ ...selectedBooking });
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(false);
    setEditedData(null);
  };

  const handleSave = async () => {
    try {
      // Format the date properly before sending
      const formattedData = {
        ...editedData,
        date: new Date(editedData.date).toISOString(),
        guestCount: parseInt(editedData.guestCount),
      };

      // Remove any undefined or null values
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === undefined || formattedData[key] === null) {
          delete formattedData[key];
        }
      });

      console.log('Sending data:', formattedData); // Debug log

      const response = await axios.put(`/api/bookings/update/${editedData._id}`, formattedData);
      if (response.data) {
        showNotification('Booking updated successfully');
        setIsEditing(false);
        setSelectedBooking(response.data.booking);
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking:', error.response?.data || error);
      showNotification('Failed to update booking: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const handleViewDocument = (documentUrl, documentType) => {
    setSelectedDocument(documentUrl);
    setSelectedDocumentType(documentType || 'Document');
    setShowDocumentViewer(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {showDocumentViewer && (
        <DocumentViewer
          documentUrl={selectedDocument}
          documentType={selectedDocumentType}
          onClose={() => {
            setShowDocumentViewer(false);
            setSelectedDocument(null);
            setSelectedDocumentType('Document');
          }}
        />
      )}

      {showRejectionModal && (
        <RejectionModal
          onClose={() => {
            setShowRejectionModal(false);
            setRejectionBookingId(null);
          }}
          onSubmit={handleRejectionSubmit}
        />
      )}

      <div className="border-b pb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Booking Management</h2>
          <div className="text-sm text-gray-500">
            Total Bookings: {bookings.length}
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No bookings found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-4 px-2">Customer</th>
                <th className="py-4 px-2">Service</th>
                <th className="py-4 px-2">Date</th>
                <th className="py-4 px-2">Time</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-2">{booking.name}</td>
                  <td className="py-4 px-2">{booking.eventType}</td>
                  <td className="py-4 px-2">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2">{booking.startTime}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      booking.status === 'Booked' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex space-x-2">
                      {booking.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(booking._id)} 
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Approve Booking"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleReject(booking._id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Reject Booking"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {booking.status === 'Approved' && (
                        <button 
                          onClick={() => handleConfirmBooking(booking._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Confirm Booking
                        </button>
                      )}
                      <button 
                        onClick={() => handleViewBooking(booking)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {isEditing ? 'Edit Booking' : 'Booking Details'}
              </h2>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setIsEditing(false);
                  setEditedData(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="mt-1">{selectedBooking.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="mt-1">{selectedBooking.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="mt-1">{selectedBooking.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-4">Event Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Type</label>
                    {isEditing ? (
                      <select
                        value={editedData.eventType}
                        onChange={(e) => setEditedData({ ...editedData, eventType: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      >
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="social">Social Gathering</option>
                      </select>
                    ) : (
                      <p className="mt-1">{selectedBooking.eventType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Guest Count</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedData.guestCount}
                        onChange={(e) => setEditedData({ ...editedData, guestCount: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="mt-1">{selectedBooking.guestCount}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedData.date.split('T')[0]}
                        onChange={(e) => setEditedData({ ...editedData, date: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="mt-1">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      {isEditing ? (
                        <>
                          <input
                            type="time"
                            value={editedData.startTime}
                            onChange={(e) => setEditedData({ ...editedData, startTime: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          />
                          <input
                            type="time"
                            value={editedData.endTime}
                            onChange={(e) => setEditedData({ ...editedData, endTime: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          />
                        </>
                      ) : (
                        <p className="mt-1">{`${selectedBooking.startTime} - ${selectedBooking.endTime}`}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-4">Event Document</h3>
                {selectedBooking.eventDocument ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDocument(selectedBooking.eventDocument, selectedBooking.documentType || 'Document')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <DocumentIcon className="h-5 w-5 mr-2" />
                        View Document
                      </button>
                      <button
                        onClick={() => window.open(selectedBooking.eventDocument, '_blank')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download
                      </button>
                      {isEditing && (
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('document', file);
                              axios.post('/api/bookings/upload-document', formData, {
                                headers: {
                                  'Content-Type': 'multipart/form-data'
                                }
                              })
                              .then(response => {
                                setEditedData({
                                  ...editedData,
                                  eventDocument: response.data.documentUrl
                                });
                              })
                              .catch(error => {
                                console.error('Error uploading document:', error);
                                showNotification('Failed to upload document', 'error');
                              });
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Document Name: {selectedBooking.eventDocument.split('/').pop()}</p>
                      <p>Document Type: {selectedBooking.eventDocument.split('.').pop().toUpperCase()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No document uploaded</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                {isEditing ? (
                  <textarea
                    value={editedData.additionalNotes}
                    onChange={(e) => setEditedData({ ...editedData, additionalNotes: e.target.value })}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                ) : (
                  <p className="mt-1">{selectedBooking.additionalNotes}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                {!isEditing && (
                  <button
                    onClick={handleStartEditing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Booking
                  </button>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;