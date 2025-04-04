import { useState } from 'react';
import { FaHeart, FaBriefcase, FaBirthdayCake, FaGlassCheers, FaGraduationCap, FaHandshake } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EventInquiryForm from '../components/user/EventInquiryForm';

function EventCategories() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('');

  const categories = [
    {
      id: 'weddings',
      title: 'Weddings',
      icon: FaHeart,
      description: 'Create your dream wedding in our elegant venue',
      capacity: '50-1000 guests',
      membershipPricing: {
        samajMember: '₹1,25,000',
        nonSamajMember: '₹1,50,000'
      },
      features: [
        'Dedicated bridal suite',
        'Customizable decoration themes',
        'Professional lighting setup',
        'Spacious dance floor',
        'Premium catering services',
        'Valet parking'
      ],
      packages: [
        {
          name: 'Classic Wedding',
          price: '₹2,50,000',
          includes: [
            'Basic venue decoration',
            'Sound system',
            'Basic lighting',
            'Seating for 200 guests',
            '4-hour venue access'
          ]
        },
        {
          name: 'Premium Wedding',
          price: '₹5,00,000',
          includes: [
            'Premium decoration with flowers',
            'Advanced lighting system',
            'DJ setup',
            'Seating for 500 guests',
            'Bridal room access',
            '8-hour venue access'
          ]
        },
        {
          name: 'Luxury Wedding',
          price: '₹8,00,000',
          includes: [
            'Exclusive venue access',
            'Custom theme decoration',
            'Premium sound & lighting',
            'LED wall backdrop',
            'Seating for 1000 guests',
            'Full-day venue access'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'
    },
    {
      id: 'corporate',
      title: 'Corporate Events',
      icon: FaBriefcase,
      description: 'Professional business gatherings',
      capacity: '20-500 guests',
      membershipPricing: {
        samajMember: '₹75,000',
        nonSamajMember: '₹90,000'
      },
      features: [
        'High-speed WiFi',
        'Professional AV equipment',
        'Breakout rooms',
        'Business center',
        'Catering services',
        'Free parking'
      ],
      packages: [
        {
          name: 'Basic Corporate',
          price: '₹1,00,000',
          includes: [
            'Conference room setup',
            'Basic AV equipment',
            'WiFi access',
            'Seating for 100 guests',
            '4-hour venue access'
          ]
        },
        {
          name: 'Executive Corporate',
          price: '₹2,50,000',
          includes: [
            'Multiple room access',
            'Advanced AV setup',
            'Video conferencing',
            'Seating for 250 guests',
            'Full-day venue access'
          ]
        },
        {
          name: 'Premium Corporate',
          price: '₹4,00,000',
          includes: [
            'Exclusive venue access',
            'Complete AV solution',
            'Event coordination',
            'Seating for 500 guests',
            'Two-day venue access'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205'
    },
    {
      id: 'birthday',
      title: 'Birthday Parties',
      icon: FaBirthdayCake,
      description: 'Celebrate another year of life',
      capacity: '20-200 guests',
      membershipPricing: {
        samajMember: '₹50,000',
        nonSamajMember: '₹65,000'
      },
      features: [
        'Customizable themes',
        'Entertainment options',
        'Decoration services',
        'Catering packages',
        'Party planning assistance',
        'Photography services'
      ],
      packages: [
        {
          name: 'Basic Birthday',
          price: '₹50,000',
          includes: [
            'Basic decoration',
            'Sound system',
            'Seating for 50 guests',
            '4-hour venue access',
            'Basic catering'
          ]
        },
        {
          name: 'Premium Birthday',
          price: '₹1,00,000',
          includes: [
            'Theme decoration',
            'Entertainment system',
            'Seating for 100 guests',
            '6-hour venue access',
            'Premium catering'
          ]
        },
        {
          name: 'Luxury Birthday',
          price: '₹2,00,000',
          includes: [
            'Custom theme setup',
            'Live entertainment',
            'Seating for 200 guests',
            'Full-day venue access',
            'Gourmet catering'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84'
    },
    {
      id: 'social',
      title: 'Social Gatherings',
      icon: FaGlassCheers,
      description: 'Connect with friends and family',
      capacity: '30-300 guests',
      membershipPricing: {
        samajMember: '₹60,000',
        nonSamajMember: '₹75,000'
      },
      features: [
        'Flexible space setup',
        'Sound system',
        'Ambient lighting',
        'Catering options',
        'Bar services',
        'Event coordination'
      ],
      packages: [
        {
          name: 'Basic Social',
          price: '₹75,000',
          includes: [
            'Basic venue setup',
            'Sound system',
            'Seating for 75 guests',
            '4-hour venue access',
            'Basic catering'
          ]
        },
        {
          name: 'Premium Social',
          price: '₹1,50,000',
          includes: [
            'Custom setup',
            'Entertainment system',
            'Seating for 150 guests',
            '6-hour venue access',
            'Premium catering'
          ]
        },
        {
          name: 'Luxury Social',
          price: '₹2,50,000',
          includes: [
            'Exclusive venue access',
            'Complete entertainment',
            'Seating for 300 guests',
            'Full-day venue access',
            'Premium catering & bar'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'
    },
    {
      id: 'graduation',
      title: 'Graduations',
      icon: FaGraduationCap,
      description: 'Commemorate academic achievements',
      capacity: '50-400 guests',
      membershipPricing: {
        samajMember: '₹80,000',
        nonSamajMember: '₹95,000'
      },
      features: [
        'Stage setup',
        'Professional sound',
        'Photography area',
        'Catering services',
        'Decoration packages',
        'Coordination services'
      ],
      packages: [
        {
          name: 'Basic Graduation',
          price: '₹1,00,000',
          includes: [
            'Basic stage setup',
            'Sound system',
            'Seating for 100 guests',
            '4-hour venue access',
            'Basic catering'
          ]
        },
        {
          name: 'Premium Graduation',
          price: '₹2,00,000',
          includes: [
            'Enhanced stage setup',
            'Professional AV system',
            'Seating for 200 guests',
            '6-hour venue access',
            'Premium catering'
          ]
        },
        {
          name: 'Luxury Graduation',
          price: '₹3,00,000',
          includes: [
            'Custom stage design',
            'Complete AV solution',
            'Seating for 400 guests',
            'Full-day venue access',
            'Premium catering & services'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94'
    },
    {
      id: 'private',
      title: 'Private Events',
      icon: FaHandshake,
      description: 'Custom events for any occasion',
      capacity: '20-200 guests',
      membershipPricing: {
        samajMember: '₹70,000',
        nonSamajMember: '₹85,000'
      },
      features: [
        'Customizable space',
        'Flexible setup options',
        'Event planning support',
        'Catering services',
        'Technical support',
        'Dedicated coordinator'
      ],
      packages: [
        {
          name: 'Basic Private',
          price: '₹75,000',
          includes: [
            'Basic venue setup',
            'Sound system',
            'Seating for 50 guests',
            '4-hour venue access',
            'Basic services'
          ]
        },
        {
          name: 'Premium Private',
          price: '₹1,50,000',
          includes: [
            'Custom setup',
            'AV equipment',
            'Seating for 100 guests',
            '6-hour venue access',
            'Premium services'
          ]
        },
        {
          name: 'Luxury Private',
          price: '₹2,50,000',
          includes: [
            'Exclusive access',
            'Complete setup',
            'Seating for 200 guests',
            'Full-day venue access',
            'Premium services & support'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329'
    }
  ];

  const handleBookNow = (eventType) => {
    setSelectedEventType(eventType);
    setShowInquiryForm(true);
    navigate(`/booking?eventType=${encodeURIComponent(eventType)}`);
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Categories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our versatile venue options for different types of events. 
            Select a category to learn more about our specialized packages and services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl ${
                selectedCategory?.id === category.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <category.icon className="text-4xl text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{category.title}</h3>
                <p className="text-gray-600 text-center mb-2">{category.description}</p>
                <p className="text-sm text-gray-500 text-center">Capacity: {category.capacity}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-6">{selectedCategory.title}</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-center mb-4">Venue Pricing</h3>
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <h4 className="font-medium text-gray-800 mb-2">Samaj Member</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedCategory.membershipPricing.samajMember}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <h4 className="font-medium text-gray-800 mb-2">Non-Samaj Member</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedCategory.membershipPricing.nonSamajMember}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Features</h3>
                  <ul className="space-y-2">
                    {selectedCategory.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Packages</h3>
                  <div className="space-y-4">
                    {selectedCategory.packages.map((pkg, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{pkg.name}</h4>
                          <span className="text-purple-600 font-semibold">{pkg.price}</span>
                        </div>
                        <ul className="text-sm text-gray-600">
                          {pkg.includes.map((item, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button 
                  onClick={() => handleBookNow(selectedCategory.title)}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Need a custom package or have specific requirements?
          </p>
          <button 
            onClick={handleContactClick}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Contact Our Team
          </button>
        </div>
      </div>

      {showInquiryForm && (
        <EventInquiryForm
          eventType={selectedEventType}
          onClose={() => setShowInquiryForm(false)}
        />
      )}
    </div>
  );
}

export default EventCategories;