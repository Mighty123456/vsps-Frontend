import { useState } from 'react';
import { FaStar, FaQuoteLeft, FaUser } from 'react-icons/fa';

function Testimonials() {
  const [filter, setFilter] = useState('all');

  const testimonials = [
    
  ];

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.type === filter);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read what our clients have to say about their experiences at our venue. 
            Their stories and feedback help us maintain our high standards of service.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-4 mb-12">
          {['all', 'wedding', 'corporate', 'birthday'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full transition-colors ${
                filter === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <FaUser className="w-full h-full text-gray-400 bg-gray-100 p-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.event}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-sm text-gray-500 text-right">{testimonial.date}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <FaQuoteLeft className="text-purple-200 text-4xl mb-2" />
                  <p className="text-gray-600 italic">{testimonial.comment}</p>
                </div>
                <img
                  src={testimonial.image}
                  alt={testimonial.event}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-4">
            Had an event at our venue? We'd love to hear about your experience!
          </p>
          <a
            href="/reviews/submit-review"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Share Your Experience
          </a>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;