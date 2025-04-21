import { useState, useEffect } from 'react';
import { FaUtensils, FaChair, FaMusic, FaCamera, FaClipboardList, FaAward } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ServiceInquiryForm from '../components/user/ServiceInquiryForm';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formStatus, setFormStatus] = useState({
    samuhLagan: { active: false, isCurrentlyActive: false },
    studentAwards: { active: false, isCurrentlyActive: false }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/forms/public/status`);
        setFormStatus(response.data);
      } catch (error) {
        console.error('Error fetching form status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormStatus();
  }, []);

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowInquiryForm(true);
  };

  const services = [
    {
      title: 'Catering Services',
      icon: <FaUtensils className="text-4xl text-purple-600" />,
      description: 'Professional catering services for all your events'
    },
    {
      title: 'Venue Setup',
      icon: <FaChair className="text-4xl text-purple-600" />,
      description: 'Custom venue setup and decoration services'
    },
    {
      title: 'Entertainment',
      icon: <FaMusic className="text-4xl text-purple-600" />,
      description: 'Live music and entertainment options'
    },
    {
      title: 'Photography',
      icon: <FaCamera className="text-4xl text-purple-600" />,
      description: 'Professional photography and videography services'
    }
  ];

  const forms = [
    {
      title: 'Samuh Lagan Registration',
      icon: <FaClipboardList className="text-4xl text-purple-600" />,
      description: 'Register for Samuh Lagan ceremony',
      route: '/samuh-lagan',
      isActive: formStatus.samuhLagan.isCurrentlyActive
    },
    {
      title: 'Student Award Registration',
      icon: <FaAward className="text-4xl text-purple-600" />,
      description: 'Register for student awards',
      route: '/student-awards',
      isActive: formStatus.studentAwards.isCurrentlyActive
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of services designed to make your events memorable and successful.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleBookService(service)}
            >
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="text-xl font-semibold mt-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
                {!user && (
                  <p className="text-sm text-purple-600 mt-2 italic">Login required to submit inquiry</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Forms Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Forms</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our registration forms for various events and programs.
          </p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forms.map((form, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-md transition-shadow ${
                form.isActive ? 'hover:shadow-lg cursor-pointer' : 'opacity-50'
              }`}
              onClick={() => form.isActive && navigate(form.route)}
            >
              <div className="flex flex-col items-center text-center">
                {form.icon}
                <h3 className="text-xl font-semibold mt-4 text-gray-800">{form.title}</h3>
                <p className="text-gray-600 mt-2">{form.description}</p>
                {form.isActive ? (
                  <p className="text-sm text-green-600 mt-2">Form is currently active</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">Form is currently inactive</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showInquiryForm && selectedService && (
        <ServiceInquiryForm
          serviceName={selectedService.title}
          onClose={() => setShowInquiryForm(false)}
        />
      )}
    </div>
  );
}

export default Services;