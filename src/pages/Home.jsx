import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendar, FaUsers, FaGem, FaClock, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import NoticeModal from '../components/NoticeModal';
import useFormNotice from '../hooks/useFormNotice';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [homeContent, setHomeContent] = useState({
    heroSlider: [],
    introduction: {
      heading: '',
      description: '',
      highlights: [],
      download: {
        label: '',
        url: '',
        fileName: ''
      }
    },
    about: {
      heading: '',
      description: '',
      image: '',
      features: []
    },
    leadership: {
      heading: '',
      description: '',
      members: [],
      note: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotice, activeForm, handleCloseNotice } = useFormNotice();

  // Helper function to format image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If it's already a full URL (including Cloudinary URLs), return as is
    if (imagePath.startsWith('http')) return imagePath;
    // If it's a Cloudinary URL without the protocol, add https
    if (imagePath.startsWith('//')) return `https:${imagePath}`;
    // For any other case, return the path as is
    return imagePath;
  };

  // Helper function to get fallback image URL
  const getFallbackImage = (type) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    switch (type) {
      case 'hero':
        return `https://res.cloudinary.com/${cloudName}/image/upload/v1/website-content/fallback/hero-placeholder.jpg`;
      case 'about':
        return `https://res.cloudinary.com/${cloudName}/image/upload/v1/website-content/fallback/about-placeholder.jpg`;
      case 'member':
        return `https://res.cloudinary.com/${cloudName}/image/upload/v1/website-content/fallback/member-placeholder.jpg`;
      default:
        return `https://res.cloudinary.com/${cloudName}/image/upload/v1/website-content/fallback/default-placeholder.jpg`;
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await axios.get('/api/content/home');
      if (response.data.success) {
        setHomeContent(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch home content');
      }
    } catch (err) {
      console.error('Error fetching home content:', err);
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (homeContent.heroSlider.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % homeContent.heroSlider.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [homeContent.heroSlider]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % homeContent.heroSlider.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + homeContent.heroSlider.length) % homeContent.heroSlider.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section with Slider */}
        <div className="relative h-[600px] w-full overflow-hidden z-0">
          {homeContent.heroSlider.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={getImageUrl(slide.image)}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (!e.target.src.includes('cloudinary.com')) {
                    console.error('Error loading image:', slide.image);
                    e.target.src = getFallbackImage('hero');
                  }
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50">
                <div className="container mx-auto h-full flex items-center justify-center px-4">
                  <div className="text-center text-white max-w-3xl">
                    <h1 className="text-5xl font-bold mb-6">{slide.title}</h1>
                    <p className="text-xl mb-8">{slide.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Slider Controls */}
          {homeContent.heroSlider.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-4 rounded-full transition-colors"
              >
                <FaArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-4 rounded-full transition-colors"
              >
                <FaArrowRight className="w-6 h-6" />
              </button>

              {/* Slider Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {homeContent.heroSlider.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Introduction Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">{homeContent.introduction.heading}</h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">{homeContent.introduction.description}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {homeContent.introduction.highlights.map((highlight, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {getIconComponent(highlight.icon)}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{highlight.title}</h3>
                    <p className="text-gray-600">{highlight.subtitle}</p>
                  </div>
                ))}
              </div>
              {/* Download Button */}
              {homeContent.introduction.download.label && (
                <div className="mt-8">
                  <a
                    href={homeContent.introduction.download.url}
                    download={homeContent.introduction.download.fileName}
                    className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-lg"
                  >
                    <FaDownload className="mr-3 w-5 h-5" />
                    {homeContent.introduction.download.label}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={getImageUrl(homeContent.about.image)}
                    alt="Party Plot"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (!e.target.src.includes('cloudinary.com')) {
                        console.error('Error loading image:', homeContent.about.image);
                        e.target.src = getFallbackImage('about');
                      }
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600 rounded-lg -z-10"></div>
              </div>
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-gray-900">{homeContent.about.heading}</h2>
                <p className="text-xl text-gray-600 leading-relaxed">{homeContent.about.description}</p>
                <div className="space-y-6">
                  {homeContent.about.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                        <span className="text-purple-600 text-lg">✓</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{homeContent.leadership.heading}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homeContent.leadership.description}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16 max-w-5xl mx-auto">
              {homeContent.leadership.members.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                  <div className="relative">
                    <div className="aspect-w-4 aspect-h-5">
                      <img 
                        src={getImageUrl(member.image)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (!e.target.src.includes('cloudinary.com')) {
                            console.error('Error loading image:', member.image);
                            e.target.src = getFallbackImage('member');
                          }
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                      <p className="text-purple-200 font-medium">{member.title}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {homeContent.leadership.note && (
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-xl text-gray-600 italic">
                  {homeContent.leadership.note}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <NoticeModal
        open={showNotice}
        onClose={handleCloseNotice}
        formData={activeForm}
      />
    </>
  );
}

// Helper function to get icon component
const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'fa-calendar':
      return <FaCalendar className="text-2xl text-purple-600" />;
    case 'fa-users':
      return <FaUsers className="text-2xl text-purple-600" />;
    case 'fa-gem':
      return <FaGem className="text-2xl text-purple-600" />;
    case 'fa-clock':
      return <FaClock className="text-2xl text-purple-600" />;
    case 'fa-download':
      return <FaDownload className="text-2xl text-purple-600" />;
    default:
      return null;
  }
};

export default Home;