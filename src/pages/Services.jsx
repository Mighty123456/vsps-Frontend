import { useState } from 'react';
import { FaUtensils, FaChair, FaMusic, FaCamera, FaCar, FaLightbulb, FaWifi, FaSnowflake } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ServiceInquiryForm from '../components/user/ServiceInquiryForm';

function Services() {
  const navigate = useNavigate();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowInquiryForm(true);
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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