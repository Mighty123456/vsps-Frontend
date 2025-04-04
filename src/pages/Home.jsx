import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendar, FaUsers, FaGem, FaClock, FaDownload } from 'react-icons/fa';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/public/assets/13.jpg',
      title: "Elegant Party Venues",
      description: "Perfect settings for your special occasions"
    },
    {
      image: '/public/assets/4.jpg',
      title: "Wedding Celebrations",
      description: "Create unforgettable moments"
    },
    {
      image: '/public/assets/15.jpg',
      title: "Corporate Events",
      description: "Professional spaces for business gatherings"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Slider */}
      <div className="relative h-[600px] w-full overflow-hidden z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="container mx-auto h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl mb-8">{slide.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-colors"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-colors"
        >
          <FaArrowRight />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to VSPS</h2>
            <p className="text-lg text-gray-600 mb-8">
              Experience luxury and elegance at its finest in our state-of-the-art party plot. 
              Located in the heart of the city, we offer the perfect venue for all your special occasions, 
              from weddings and corporate events to birthday celebrations and social gatherings.
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendar className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">500+ Events</h3>
                <p className="text-gray-600">Successfully Hosted</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1000+ Capacity</h3>
                <p className="text-gray-600">Spacious Venue</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGem className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Premium Services</h3>
                <p className="text-gray-600">World-class Amenities</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Always Available</p>
              </div>
            </div>
            {/* Download Button */}
            <div className="mt-12">
              <a
                href="/path/to/your/file.pdf" // Replace with the actual path to your PDF file
                download="Vadi_PartyPlot_Instructions.pdf"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                Download Instructions (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* About Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/public/assets/20.jpg"
                alt="Party Plot"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About VSPS</h2>
              <p className="text-lg text-gray-600 mb-6">
                For over a decade, Royal Party Plot has been the premier destination for 
                memorable celebrations in our city. Our journey began with a simple vision: 
                to create a space where moments turn into cherished memories.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600">✓</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Luxurious Amenities</h3>
                    <p className="text-gray-600">State-of-the-art facilities including modern kitchen, spacious parking, and premium decor.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600">✓</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Team</h3>
                    <p className="text-gray-600">Dedicated event coordinators and staff to ensure your event runs smoothly.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600">✓</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Customizable Packages</h3>
                    <p className="text-gray-600">Flexible event packages to suit your specific needs and budget.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wadi Pramukh Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Meet the visionary behind VSPS Party Plot who has transformed the event hosting experience.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="text-center">
        <img 
          src="/public/assets/21.jpg" // Update with your actual image path
          alt="Wadi Pramukh"
          className="rounded-lg shadow-lg mx-auto w-full max-w-md"
        />
        <h3 className="text-xl font-semibold mt-4">Wadi Pramukh</h3>
        <p className="text-gray-600">Founder & Visionary</p>
      </div>
      
      <div className="text-center">
        <img 
          src="/public/assets/22.jpg" // Update with your actual image path
          alt="Wadi Pramukh at an event"
          className="rounded-lg shadow-lg mx-auto w-full max-w-md"
        />
        <h3 className="text-xl font-semibold mt-4">Wadi Pramukh</h3>
        <p className="text-gray-600">At VSPS Event</p>
      </div>
    </div>
    
    <div className="mt-12 max-w-3xl mx-auto text-center">
      <p className="text-lg text-gray-600">
        Under the guidance of Wadi Pramukh, VSPS has become synonymous with excellence in event hosting. 
        His dedication to quality and customer satisfaction has shaped our venue into what it is today.
      </p>
    </div>
  </div>
</section>




    </div>
  );
}

export default Home;