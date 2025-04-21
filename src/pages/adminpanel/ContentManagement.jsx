import { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  getEventCategories,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from "../../services/crudapi";
import axios from 'axios';
import { FaCalendar, FaUsers, FaGem, FaClock, FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary, deleteFromCloudinary, FOLDERS } from '../../config/cloudinary';
import TestUpload from '../../components/TestUpload';

const ContentManagement = () => {
  // Helper function to construct image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    // If it's already a full URL (including Cloudinary URLs), return as is
    if (imagePath.startsWith('http')) return imagePath;
    // For any other case, return the data URL placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  };

  // Add this helper function for image error handling
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    
    // If the image is already a data URL, don't try to replace it again
    if (e.target.src.startsWith('data:')) {
      console.log('Already using data URL placeholder, skipping replacement');
      return;
    }
    
    // Use the data URL placeholder
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    
    // Remove the error handler to prevent infinite loops
    e.target.onerror = null;
  };

  // State for active tab and content types
  const [activeTab, setActiveTab] = useState('home');
  const [contentTypes] = useState([
    { id: 'home', name: 'Home Page' },
    { id: 'events', name: 'Event Categories' },
    { id: 'gallery', name: 'Gallery' }
  ]);

  // State for content data
  const [homeContent, setHomeContent] = useState(null);
  const [eventCategories, setEventCategories] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for editing
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [galleryTab, setGalleryTab] = useState('photos'); // For gallery sub-tabs

  // State for preview images
  const [previewImages, setPreviewImages] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  // Fetch all content on component mount and tab change
  useEffect(() => {
    fetchAllContent();
  }, [activeTab, galleryTab]);

  const fetchAllContent = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'home') {
        // Fetch home page content from MongoDB
        const response = await axios.get('/api/content/home');
        if (response.data.success) {
          setHomeContent(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch home content');
        }
      } else if (activeTab === 'events') {
        const categories = await getEventCategories();
        setEventCategories(categories);
      } else if (activeTab === 'gallery') {
        const items = await getGalleryItems(galleryTab === 'photos' ? 'photo' : 'video');
        setGalleryItems(items);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message || 'Failed to fetch content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete operation
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setError(null);
      let response;

      switch (type) {
        case 'hero-slide':
          response = await axios.delete(`/api/content/home/hero-slide/${id}`);
          break;
        case 'event-category':
          response = await deleteEventCategory(id);
          break;
        case 'gallery':
          response = await deleteGalleryItem(id);
          if (!response.success) {
            throw new Error(response.message || 'Failed to delete gallery item');
          }
          break;
        case 'leadership-member':
          response = await axios.delete(`/api/content/home/leadership/members/${id}`);
          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete member');
          }
          // Update the local state to remove the member immediately
          setHomeContent(prevContent => {
            if (!prevContent?.leadership?.members) return prevContent;
            return {
              ...prevContent,
              leadership: {
                ...prevContent.leadership,
                members: prevContent.leadership.members.filter(member => member._id !== id)
              }
            };
          });
          break;
        default:
          throw new Error('Invalid item type');
      }

      toast.success(response.data.message || 'Item deleted successfully');
      // Only fetch content if it's not a leadership member deletion
      if (type !== 'leadership-member') {
        await fetchAllContent();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message || 'Failed to delete item. Please try again.');
      toast.error(err.message || 'Failed to delete item');
    }
  };

  // Update the prepareFormData function for home content
  const prepareFormData = async () => {
    const form = document.querySelector('form');
    const formEntries = new FormData(form);
    const data = new FormData();

    // Get the content type from editingItem if available, otherwise use activeTab
    const contentType = editingItem?._contentType || activeTab;

    try {
      switch (contentType) {
        case 'hero-slide':
          data.append('title', formEntries.get('title') || '');
          data.append('description', formEntries.get('description') || '');
          if (formEntries.get('image') instanceof File) {
            data.append('image', formEntries.get('image'));
          } else if (formEntries.get('image')) {
            data.append('image', formEntries.get('image'));
          }
          data.append('isActive', formEntries.get('isActive') === 'on' ? 'true' : 'false');
          data.append('order', formEntries.get('order') || '0');
          break;

        case 'introduction':
          data.append('heading', formEntries.get('heading') || '');
          data.append('description', formEntries.get('description') || '');
          
          // Handle highlights array
          const highlights = [];
          const highlightCount = parseInt(formEntries.get('highlightCount') || '0');
          for (let i = 0; i < highlightCount; i++) {
            highlights.push({
              title: formEntries.get(`highlights[${i}].title`) || '',
              subtitle: formEntries.get(`highlights[${i}].subtitle`) || '',
              icon: formEntries.get(`highlights[${i}].icon`) || 'fa-calendar'
            });
          }
          data.append('highlights', JSON.stringify(highlights));

          // Handle download section
          const downloadFile = formEntries.get('download.file');
          if (downloadFile instanceof File) {
            data.append('downloadFile', downloadFile);
          }
          
          data.append('download', JSON.stringify({
            label: formEntries.get('download.label') || '',
            fileName: formEntries.get('download.fileName') || '',
            url: editingItem.download?.url || '' // Preserve existing URL if no new file
          }));
          break;

        case 'about':
          data.append('heading', formEntries.get('heading') || '');
          data.append('description', formEntries.get('description') || '');
          if (formEntries.get('image') instanceof File) {
            data.append('image', formEntries.get('image'));
          } else if (formEntries.get('image')) {
            data.append('image', formEntries.get('image'));
          }
          
          // Handle features array
          const features = [];
          const featureCount = parseInt(formEntries.get('featureCount') || '0');
          for (let i = 0; i < featureCount; i++) {
            features.push({
              title: formEntries.get(`features[${i}].title`) || '',
              description: formEntries.get(`features[${i}].description`) || ''
            });
          }
          data.append('features', JSON.stringify(features));
          break;

        case 'leadership':
          // Handle leadership section fields
          data.append('heading', formEntries.get('heading') || '');
          data.append('description', formEntries.get('description') || '');
          data.append('note', formEntries.get('note') || '');
          
          // Handle members array
          const members = [];
          const memberCount = parseInt(formEntries.get('memberCount') || '0');
          for (let i = 0; i < memberCount; i++) {
            const memberData = {
              name: formEntries.get(`members[${i}].name`) || '',
              position: formEntries.get(`members[${i}].title`) || '',
              description: formEntries.get(`members[${i}].description`) || ''
            };
            
            // Handle member image
            if (selectedFiles[i]) {
              data.append(`memberImage${i}`, selectedFiles[i]);
            } else if (editingItem.members[i]?.image) {
              memberData.image = editingItem.members[i].image;
            }
            
            members.push(memberData);
          }
          data.append('members', JSON.stringify(members));
          break;

        case 'event-category':
          data.append('title', formEntries.get('title') || '');
          data.append('description', formEntries.get('description') || '');
          data.append('icon', formEntries.get('icon') || '');
          data.append('capacity', formEntries.get('capacity') || '');
          if (formEntries.get('image') instanceof File) {
            data.append('image', formEntries.get('image'));
          } else if (formEntries.get('image')) {
            data.append('image', formEntries.get('image'));
          }
          data.append('membershipPricing', JSON.stringify({
            samajMember: formEntries.get('samajMember') || '',
            nonSamajMember: formEntries.get('nonSamajMember') || ''
          }));
          data.append('isActive', formEntries.get('isActive') === 'on' ? 'true' : 'false');
          break;

        case 'gallery':
          if (formEntries.get('file') instanceof File) {
            data.append('file', formEntries.get('file'));
          }
          // Ensure category and type are always set with valid values
          const category = formEntries.get('category') || 'weddings';
          // Validate category against allowed values
          const validCategories = ['weddings', 'corporate', 'birthdays', 'social', 'graduation', 'private'];
          const validCategory = validCategories.includes(category) ? category : 'weddings';
          
          const type = formEntries.get('type') || 'photo';
          data.append('category', validCategory);
          data.append('type', type);
          break;

        default:
          console.error('Invalid content type:', contentType);
          throw new Error(`Invalid content type: ${contentType}`);
      }

      return data;
    } catch (error) {
      console.error('Error preparing form data:', error);
      throw error;
    }
  };

  // Update the handleSubmit function for home content
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const contentType = editingItem._contentType;
      let response;
      let formData;

      formData = await prepareFormData();
      
      switch (contentType) {
        case 'hero-slide':
          if (editingItem?._id) {
            response = await axios.put(`/api/content/home/hero-slide/${editingItem._id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          } else {
            response = await axios.post(`/api/content/home/hero-slide`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          }
          break;
          
        case 'introduction':
          response = await axios.put(`/api/content/home/introduction`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          break;
          
        case 'about':
          response = await axios.put(`/api/content/home/about`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          break;
          
        case 'leadership':
          // Update the leadership section with all members in one request
          response = await axios.put(`/api/content/home/leadership`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          break;
          
        case 'gallery':
          if (editingItem._id) {
            response = await axios.put(`/api/content/gallery/${editingItem._id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          } else {
            response = await axios.post(`/api/content/gallery`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          }
          break;
          
        default:
          console.error('Invalid content type:', contentType);
          throw new Error(`Invalid content type: ${contentType}`);
      }

      if (response?.data?.success) {
        toast.success(response.data.message || `${contentType.replace('-', ' ')} ${editingItem?._id ? 'updated' : 'added'} successfully`);
        setEditingItem(null);
        setIsEditing(false);
        setIsAdding(false);
        await fetchAllContent();
      } else {
        throw new Error(response?.data?.message || 'Failed to save content');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while saving the content';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading) return <div className="py-8 text-center">Loading content...</div>;
    if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'events':
        return renderEventCategories();
      case 'gallery':
        return renderGalleryItems();
      default:
        return null;
    }
  };

  const renderHomeContent = () => {
    console.log('Rendering home content:', homeContent);
    
    return (
      <div className="space-y-8">
        {/* Hero Slider Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Hero Slider</h3>
        <button 
              onClick={() => {
                setEditingItem({
                  _contentType: 'hero-slide',
                  title: '',
                  description: '',
                  image: '',
                  isActive: true
                });
                setIsAdding(true);
              }}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add New Slide</span>
        </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeContent?.heroSlider?.map((slide, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem({
                        ...slide,
                        _contentType: 'hero-slide',
                        _id: slide._id
                      });
                      setIsEditing(true);
                    }}
                    className="p-1.5 bg-white rounded-full shadow"
                  >
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete('hero-slide', slide._id)}
                    className="p-1.5 bg-white rounded-full shadow"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
                <img
                  src={getImageUrl(slide.image)}
                  alt={slide.title}
                  className="w-full h-48 object-cover rounded mb-3"
                  onError={handleImageError}
                />
                <h4 className="font-semibold mb-2">{slide.title}</h4>
                <p className="text-sm text-gray-600">{slide.description}</p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Introduction Section</h3>
            <button
              onClick={() => {
                setEditingItem({
                  _contentType: 'introduction',
                  heading: homeContent?.introduction?.heading || '',
                  description: homeContent?.introduction?.description || '',
                  highlights: homeContent?.introduction?.highlights || [],
                  download: homeContent?.introduction?.download || {
                    label: '',
                    url: '',
                    fileName: ''
                  }
                });
                setIsEditing(true);
              }}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Edit Introduction</span>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Heading</h4>
              <p className="text-gray-600">{homeContent?.introduction?.heading}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Description</h4>
              <p className="text-gray-600">{homeContent?.introduction?.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Highlights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                {homeContent?.introduction?.highlights?.map((highlight, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {getIconComponent(highlight.icon)}
                      <h5 className="font-medium">{highlight.title}</h5>
                    </div>
                    <p className="text-sm text-gray-600">{highlight.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Download Section</h4>
              <div className="mt-2">
                <p className="text-gray-600">
                  Label: {homeContent?.introduction?.download?.label}
                </p>
                <p className="text-gray-600">
                  File: {homeContent?.introduction?.download?.fileName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">About Section</h3>
            <button
              onClick={() => {
                setEditingItem({
                  _contentType: 'about',
                  heading: homeContent?.about?.heading || '',
                  description: homeContent?.about?.description || '',
                  image: homeContent?.about?.image || '',
                  features: homeContent?.about?.features || []
                });
                setIsEditing(true);
              }}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Edit About</span>
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={getImageUrl(homeContent?.about?.image)}
                alt="About Section"
                className="w-full h-64 object-cover rounded-lg"
                onError={handleImageError}
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Heading</h4>
                <p className="text-gray-600">{homeContent?.about?.heading}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Description</h4>
                <p className="text-gray-600">{homeContent?.about?.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Features</h4>
                <div className="space-y-2 mt-2">
                  {homeContent?.about?.features?.map((feature, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium">{feature.title}</h5>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Leadership Section</h3>
            <button
              onClick={() => {
                setEditingItem({
                  _contentType: 'leadership',
                  heading: homeContent?.leadership?.heading || '',
                  description: homeContent?.leadership?.description || '',
                  members: homeContent?.leadership?.members || [],
                  note: homeContent?.leadership?.note || ''
                });
                setIsEditing(true);
              }}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Edit Leadership</span>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Heading</h4>
              <p className="text-gray-600">{homeContent?.leadership?.heading}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Description</h4>
              <p className="text-gray-600">{homeContent?.leadership?.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Team Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {homeContent?.leadership?.members?.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <img
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                      onError={handleImageError}
                    />
                    <h5 className="font-medium">{member.name}</h5>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    <p className="text-sm text-gray-600 mt-2">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Note</h4>
              <p className="text-gray-600">{homeContent?.leadership?.note}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEventCategories = () => (
    <div className="space-y-6">
      {eventCategories.map((category) => (
        <div key={category._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-lg">{category.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setEditingItem({ 
                    ...category,
                    _contentType: 'event-category',
                    _id: category._id
                  });
                  setIsEditing(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleDelete('event-category', category._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {category.image && (
            <img src={getImageUrl(category.image)} alt={category.title} className="w-full h-48 object-cover rounded mb-3" />
          )}
          <p className="text-gray-600 mb-2">{category.description}</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-medium text-sm text-gray-500">Pricing</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm">Samaj Member: {category.membershipPricing.samajMember}</p>
                <p className="text-sm">Non-Samaj Member: {category.membershipPricing.nonSamajMember}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-500">Capacity</h4>
              <p className="mt-2 text-sm">{category.capacity}</p>
            </div>
          </div>
        </div>
      ))}
      <button 
        onClick={() => {
          setEditingItem({ 
            _contentType: 'event-category',
            title: '',
            description: '',
            capacity: '',
            image: '',
            membershipPricing: {
              samajMember: '',
              nonSamajMember: ''
            },
            features: [],
            packages: [],
            isActive: true
          });
          setIsAdding(true);
        }}
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add New Event Category</span>
      </button>
    </div>
  );

  const renderGalleryItems = () => (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-4">
        <button 
          className={`px-4 py-2 rounded-lg ${galleryTab === 'photos' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setGalleryTab('photos')}
        >
          Photos
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${galleryTab === 'videos' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setGalleryTab('videos')}
        >
          Videos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img 
                src={getImageUrl(item.type === 'photo' ? item.url : item.thumbnail)}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  handleImageError(e);
                }}
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => {
                    setEditingItem({ 
                      ...item,
                      _contentType: 'gallery',
                      _id: item._id
                    });
                    setIsEditing(true);
                  }}
                  className="p-1.5 bg-white rounded-full shadow"
                >
                  <PencilIcon className="h-4 w-4 text-blue-600" />
                </button>
                <button 
                  onClick={() => handleDelete('gallery', item._id)}
                  className="p-1.5 bg-white rounded-full shadow"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full capitalize">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500">
                  {item.type === 'photo' ? 'Photo' : 'Video'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => {
          setEditingItem({ 
            _contentType: 'gallery',
            type: galleryTab === 'photos' ? 'photo' : 'video',
            url: '',
            thumbnail: '',
            category: 'weddings'
          });
          setIsAdding(true);
        }}
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add New {galleryTab === 'photos' ? 'Photo' : 'Video'}</span>
      </button>
    </div>
  );

  // Render edit form based on content type
  const renderEditForm = () => {
    if (!isEditing && !isAdding) return null;

    const contentType = editingItem._contentType;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
              {isAdding ? 'Add' : 'Edit'} {contentType.replace('-', ' ')}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                  setEditingItem(null);
                }}
              className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hero Slide Form */}
            {contentType === 'hero-slide' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingItem.title || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem.description || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    name="image"
                    className="mt-1 block w-full"
                    accept="image/*"
                  />
                  {editingItem.image && (
                    <img
                      src={getImageUrl(editingItem.image)}
                      alt="Preview"
                      className="mt-2 h-32 w-auto object-cover rounded"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingItem.order || 0}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingItem.isActive !== false}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Active</label>
                </div>
              </>
            )}

            {/* Introduction Form */}
            {contentType === 'introduction' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heading</label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={editingItem.heading || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem.description || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Highlights</label>
                  <input type="hidden" name="highlightCount" value={editingItem.highlights?.length || 0} />
                  <div className="space-y-4 mt-2">
                    {editingItem.highlights?.map((highlight, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            name={`highlights[${index}].title`}
                            defaultValue={highlight.title}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                          <input
                            type="text"
                            name={`highlights[${index}].subtitle`}
                            defaultValue={highlight.subtitle}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Icon</label>
                          <select
                            name={`highlights[${index}].icon`}
                            defaultValue={highlight.icon}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="fa-calendar">Calendar</option>
                            <option value="fa-users">Users</option>
                            <option value="fa-gem">Gem</option>
                            <option value="fa-clock">Clock</option>
                            <option value="fa-download">Download</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newHighlights = [...(editingItem.highlights || []), { title: '', subtitle: '', icon: 'fa-calendar' }];
                        setEditingItem({ ...editingItem, highlights: newHighlights });
                      }}
                      className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add Highlight
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Download Section</label>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Label</label>
                      <input
                        type="text"
                        name="download.label"
                        defaultValue={editingItem.download?.label || ''}
                        placeholder="e.g., Download Instructions (PDF)"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">File</label>
                      <input
                        type="file"
                        name="download.file"
                        accept=".pdf,.doc,.docx"
                        className="mt-1 block w-full"
                      />
                      {editingItem.download?.url && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Current file:</p>
                          <a 
                            href={editingItem.download.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
                          >
                            <FaDownload />
                            {editingItem.download.fileName || 'Download File'}
                          </a>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">File Name</label>
                      <input
                        type="text"
                        name="download.fileName"
                        defaultValue={editingItem.download?.fileName || ''}
                        placeholder="e.g., Vadi_PartyPlot_Instructions.pdf"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* About Form */}
            {contentType === 'about' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heading</label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={editingItem.heading || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem.description || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    name="image"
                    className="mt-1 block w-full"
                    accept="image/*"
                  />
                  {editingItem.image && (
                    <img
                      src={getImageUrl(editingItem.image)}
                      alt="Preview"
                      className="mt-2 h-32 w-auto object-cover rounded"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <input type="hidden" name="featureCount" value={editingItem.features?.length || 0} />
                  <div className="space-y-4 mt-2">
                    {editingItem.features?.map((feature, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            name={`features[${index}].title`}
                            defaultValue={feature.title}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <input
                            type="text"
                            name={`features[${index}].description`}
                            defaultValue={feature.description}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = [...(editingItem.features || []), { title: '', description: '' }];
                        setEditingItem({ ...editingItem, features: newFeatures });
                      }}
                      className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add Feature
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Leadership Form */}
            {contentType === 'leadership' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heading</label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={editingItem.heading || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem.description || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Note</label>
                  <textarea
                    name="note"
                    defaultValue={editingItem.note || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Members</label>
                  <input type="hidden" name="memberCount" value={editingItem.members?.length || 0} />
                  <div className="space-y-4 mt-2">
                    {editingItem.members?.map((member, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name={`members[${index}].name`}
                            defaultValue={member.name}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Position</label>
                          <input
                            type="text"
                            name={`members[${index}].title`}
                            defaultValue={member.position}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name={`members[${index}].description`}
                            defaultValue={member.description}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows="2"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Image</label>
                          <input
                            type="file"
                            name={`members[${index}].image`}
                            className="mt-1 block w-full"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            key={`file-input-${index}`}
                          />
                          {(previewImages[index] || member.image) && (
                            <img
                              src={previewImages[index] || getImageUrl(member.image)}
                              alt={member.name}
                              className="mt-2 h-32 w-auto object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (member._id) {
                                handleDelete('leadership-member', member._id);
                              } else {
                                const newMembers = [...editingItem.members];
                                newMembers.splice(index, 1);
                                setEditingItem({ ...editingItem, members: newMembers });
                              }
                            }}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            <TrashIcon className="h-5 w-5" />
                            <span>Remove Member</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newMembers = [...(editingItem.members || []), { name: '', position: '', description: '', image: '' }];
                        setEditingItem({ ...editingItem, members: newMembers });
                      }}
                      className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add Team Member
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Gallery Form */}
            {contentType === 'gallery' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    defaultValue={editingItem.category || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="weddings">Weddings</option>
                    <option value="corporate">Corporate</option>
                    <option value="birthdays">Birthdays</option>
                    <option value="social">Social</option>
                    <option value="graduation">Graduation</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    defaultValue={editingItem.type || 'photo'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File</label>
                  <input
                    type="file"
                    name="file"
                    className="mt-1 block w-full"
                    accept={editingItem.type === 'video' ? 'video/*' : 'image/*'}
                    required={!editingItem._id}
                  />
                  {editingItem.url && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Current file:</p>
                      {editingItem.type === 'photo' ? (
                        <img
                          src={getImageUrl(editingItem.url)}
                          alt="Current"
                          className="mt-1 h-32 object-cover rounded"
                        />
                      ) : (
                        <video
                          src={editingItem.url}
                          controls
                          className="mt-1 h-32 rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setIsAdding(false);
                    setEditingItem(null);
                  }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isAdding ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
        </div>
      </div>
    );
  };

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

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file
      setSelectedFiles(prev => ({
        ...prev,
        [index]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({
          ...prev,
          [index]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Content Management</h2>
          <div className="flex space-x-2">
            <button 
              onClick={fetchAllContent}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Refresh"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => {
                if (activeTab === 'home') {
                  setEditingItem({ 
                    _contentType: 'hero-slide',
                    image: '',
                    title: '',
                    description: '',
                    isActive: true
                  });
                } else if (activeTab === 'events') {
                  setEditingItem({ 
                    _contentType: 'event-category',
                    title: '',
                    description: '',
                    capacity: '',
                    image: '',
                    membershipPricing: {
                      samajMember: '',
                      nonSamajMember: ''
                    },
                    features: [],
                    packages: [],
                    isActive: true
                  });
                } else if (activeTab === 'gallery') {
                  setEditingItem({ 
                    _contentType: 'gallery',
                    type: galleryTab === 'photos' ? 'photo' : 'video',
                    url: '',
                    thumbnail: '',
                    category: 'weddings'
                  });
                }
                setIsAdding(true);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add New
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Content Type Tabs */}
        <div className="flex space-x-4 mb-6">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === type.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'test'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Test Upload
          </button>
        </div>

        {/* Content Display */}
        {activeTab === 'test' ? (
          <TestUpload />
        ) : (
          renderContent()
        )}
      </div>

      {/* Edit/Add Modal */}
      {(isEditing || isAdding) && renderEditForm()}
    </div>
  );
};

export default ContentManagement;