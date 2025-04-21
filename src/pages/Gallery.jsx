import { useState, useEffect } from 'react';
import { FaImage, FaVideo, FaSearch, FaHeart, FaTimes } from 'react-icons/fa';
import { getGalleryItems } from '../services/crudapi';

function Gallery() {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [galleryItems, setGalleryItems] = useState({ photos: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['all', 'weddings', 'corporate', 'birthdays', 'social', 'graduation', 'private'];

  // Fetch gallery items when tab changes
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const items = await getGalleryItems(activeTab === 'photos' ? 'photo' : 'video');
        
        // Organize items by type
        setGalleryItems(prev => ({
          ...prev,
          [activeTab]: items
        }));
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError('Failed to load gallery items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const filteredItems = galleryItems[activeTab]?.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  ) || [];

  const handlePrevImage = () => {
    const currentIndex = filteredItems.findIndex(item => item._id === selectedImage._id);
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1]);
    }
  };

  const handleNextImage = () => {
    const currentIndex = filteredItems.findIndex(item => item._id === selectedImage._id);
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1]);
    }
  };

  // Add function to handle image click
  const handleImageClick = (item) => {
    setSelectedImage(item);
  };

  // Add function to close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Add Image Modal component
  const ImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={handleCloseModal}
      >
        <div className="relative max-w-7xl w-full">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={handleCloseModal}
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* Image */}
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.type === 'photo' ? item.url : item.thumbnail}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[90vh] object-contain mx-auto"
            />
            
            {/* Image details */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium capitalize">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of memorable events and celebrations. Get inspired by our past events and imagine your perfect celebration.
          </p>
        </div>

        {/* Tabs and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Media Type Tabs */}
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'photos'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                <FaImage />
                <span>Photos</span>
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                <FaVideo />
                <span>Videos</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Filter by:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleImageClick(item)}
              >
                <div className="relative">
                  <img
                    src={item.type === 'photo' ? item.url : item.thumbnail}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform hover:scale-105 duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                      console.error('Failed to load image:', item.url || item.thumbnail);
                    }}
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <FaVideo className="text-white text-2xl" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No gallery items found for the selected category.</p>
          </div>
        )}

        {/* Image Modal */}
        <ImageModal />
      </div>
    </div>
  );
}

export default Gallery;