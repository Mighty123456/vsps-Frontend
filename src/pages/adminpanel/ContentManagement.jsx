import { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  getHomeContent,
  updateHomeContent,
  addSlide,
  updateSlide,
  deleteSlide,
  getEventCategories,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from "../../services/crudapi";

const ContentManagement = () => {
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

  // Fetch all content on component mount and tab change
  useEffect(() => {
    fetchAllContent();
  }, [activeTab, galleryTab]);

  const fetchAllContent = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'home') {
        const content = await getHomeContent();
        setHomeContent(content);
      } else if (activeTab === 'events') {
        const categories = await getEventCategories();
        setEventCategories(categories);
      } else if (activeTab === 'gallery') {
        const items = await getGalleryItems(galleryTab === 'photos' ? 'photo' : 'video');
        setGalleryItems(items);
      }
    } catch (err) {
      setError('Failed to fetch content. Please try again.');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete operation
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (type === 'home-slide') {
        await deleteSlide(id);
      } else if (type === 'event-category') {
        await deleteEventCategory(id);
      } else if (type === 'gallery') {
        await deleteGalleryItem(id);
      }
      fetchAllContent(); // Refresh data
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error('Error deleting item:', err);
    }
  };

  // Add this helper function to properly handle form data
  const prepareFormData = (data, type) => {
    const formData = new FormData();
    
    if (type === 'home-slide') {
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('isActive', data.isActive);
      if (data.image) formData.append('image', data.image);
    } else if (type === 'event-category') {
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('capacity', data.capacity);
      formData.append('samajMemberPrice', data.samajMemberPrice);
      formData.append('nonSamajMemberPrice', data.nonSamajMemberPrice);
      formData.append('isActive', data.isActive);
      if (data.image) formData.append('image', data.image);
    } else if (type === 'gallery') {
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('type', data.type);
      if (data.file) formData.append('file', data.file);
    } else if (type === 'about') {
      formData.append('title', data.title);
      formData.append('description', data.description);
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }
      
      // Handle features
      const features = [];
      const featureTitles = Object.keys(data).filter(key => key.startsWith('features['));
      for (let i = 0; i < featureTitles.length / 2; i++) {
        features.push({
          title: data[`features[${i}].title`],
          description: data[`features[${i}].description`]
        });
      }
      formData.append('features', JSON.stringify(features));
    }
    
    return formData;
  };

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = prepareFormData(Object.fromEntries(new FormData(form)), editingItem._contentType);
    
    try {
      if (editingItem._contentType === 'home-slide') {
        if (isAdding) {
          await addSlide(formData);
        } else {
          await updateSlide(editingItem._id, formData);
        }
      } else if (editingItem._contentType === 'event-category') {
        if (isAdding) {
          await createEventCategory(formData);
        } else {
          await updateEventCategory(editingItem._id, formData);
        }
      } else if (editingItem._contentType === 'gallery') {
        if (isAdding) {
          await createGalleryItem(formData);
        } else {
          await updateGalleryItem(editingItem._id, formData);
        }
      } else if (editingItem._contentType === 'about') {
        await fetch(`${import.meta.env.VITE_API_URL}/api/content/home/about`, {
          method: 'PUT',
          body: formData
        });
      } else if (editingItem._contentType === 'leadership') {
        if (isAdding) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/content/home/leadership`, {
            method: 'POST',
            body: formData
          });
        } else {
          await fetch(`${import.meta.env.VITE_API_URL}/api/content/home/leadership/${editingItem._id}`, {
            method: 'PUT',
            body: formData
          });
        }
      }
      
      setIsEditing(false);
      setIsAdding(false);
      setEditingItem(null);
      fetchAllContent();
    } catch (err) {
      setError(`Failed to ${isAdding ? 'add' : 'update'} item. Please try again.`);
      console.error('Error saving item:', err);
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

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Hero Slider Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-3">Hero Slider</h3>
        <div className="space-y-4">
          {homeContent?.slides?.map((slide) => (
            <div key={slide._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={`${import.meta.env.VITE_API_URL}${slide.image}`} 
                  alt={slide.title} 
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">{slide.title}</h4>
                  <p className="text-sm text-gray-500">{slide.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setEditingItem({ 
                      ...slide,
                      _contentType: 'home-slide',
                      _id: slide._id
                    });
                    setIsEditing(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDelete('home-slide', slide._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-3">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {homeContent?.stats?.map((stat, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className={`text-purple-600 ${stat.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-medium">{stat.count}</h4>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section with Edit Button */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">About Section</h3>
          <button 
            onClick={() => {
              setEditingItem({ 
                ...homeContent.about,
                _contentType: 'about',
                features: homeContent.about.features || []
              });
              setIsEditing(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>
        {homeContent?.about && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={`${import.meta.env.VITE_API_URL}${homeContent.about.image}`}
                alt="About"
                className="w-32 h-32 object-cover rounded"
              />
              <div>
                <h4 className="font-medium">{homeContent.about.title}</h4>
                <p className="text-sm text-gray-500">{homeContent.about.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homeContent.about.features.map((feature, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h5 className="font-medium">{feature.title}</h5>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leadership Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-3">Leadership Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeContent?.leadership?.map((leader, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex flex-col items-center">
                <img 
                  src={`${import.meta.env.VITE_API_URL}${leader.image}`}
                  alt={leader.name}
                  className="w-32 h-32 object-cover rounded-full mb-3"
                />
                <h4 className="font-medium text-lg">{leader.name}</h4>
                <p className="text-purple-600 text-sm mb-2">{leader.role}</p>
                <p className="text-sm text-gray-500 text-center">{leader.description}</p>
              </div>
              <div className="flex justify-center space-x-2 mt-3">
                <button 
                  onClick={() => {
                    setEditingItem({ 
                      ...leader,
                      _contentType: 'leadership',
                      _id: leader._id
                    });
                    setIsEditing(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDelete('leadership', leader._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => {
            setEditingItem({ 
              _contentType: 'leadership',
              name: '',
              role: '',
              image: '',
              description: ''
            });
            setIsAdding(true);
          }}
          className="mt-4 flex items-center space-x-2 text-purple-600 hover:text-purple-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Leader</span>
        </button>
      </div>
    </div>
  );

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
            <img src={category.image} alt={category.title} className="w-full h-48 object-cover rounded mb-3" />
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
                src={`${import.meta.env.VITE_API_URL}${item.type === 'photo' ? item.url : item.thumbnail}`}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  console.error('Failed to load image:', item.url || item.thumbnail);
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
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500 truncate">{item.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <span>{item.likes} likes</span>
                </div>
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
            title: '',
            description: '',
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
    if (!editingItem) return null;

    const contentType = editingItem._contentType;
    const isSlide = contentType === 'home-slide';
    const isEventCategory = contentType === 'event-category';
    const isGalleryItem = contentType === 'gallery';
    const isLeadership = contentType === 'leadership';
    const isAbout = contentType === 'about';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isAdding ? 'Add New' : 'Edit'} {isSlide ? 'Slide' : isEventCategory ? 'Event Category' : isLeadership ? 'Leader' : isAbout ? 'About Section' : 'Gallery Item'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                  setEditingItem(null);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {isSlide && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {editingItem.image && !isAdding && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Current Image:</p>
                        <img src={editingItem.image} alt="Current" className="h-20 mt-1" />
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingItem.title}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={editingItem.isActive}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </>
              )}

              {isEventCategory && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingItem.title}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <input
                        type="text"
                        name="capacity"
                        defaultValue={editingItem.capacity}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {editingItem.image && !isAdding && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Current Image:</p>
                        <img src={editingItem.image} alt="Current" className="h-20 mt-1" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Samaj Member Price</label>
                      <input
                        type="text"
                        name="samajMemberPrice"
                        defaultValue={editingItem.membershipPricing?.samajMember}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Non-Samaj Member Price</label>
                      <input
                        type="text"
                        name="nonSamajMemberPrice"
                        defaultValue={editingItem.membershipPricing?.nonSamajMember}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={editingItem.isActive}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </>
              )}

              {isGalleryItem && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingItem.title}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingItem.type === 'photo' ? 'Photo' : 'Video Thumbnail'}
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept={editingItem.type === 'photo' ? 'image/*' : 'video/*'}
                      className="w-full px-3 py-2 border rounded-lg"
                      required={isAdding}
                    />
                    {!isAdding && (editingItem.url || editingItem.thumbnail) && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Current:</p>
                        <img 
                          src={`${import.meta.env.VITE_API_URL}${editingItem.type === 'photo' ? editingItem.url : editingItem.thumbnail}`}
                          alt="Current" 
                          className="h-20 mt-1"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                            console.error('Failed to load image:', editingItem.url || editingItem.thumbnail);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <input 
                    type="hidden" 
                    name="type" 
                    value={editingItem.type} 
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={editingItem.category}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="weddings">Weddings</option>
                      <option value="corporate">Corporate</option>
                      <option value="birthdays">Birthdays</option>
                      <option value="social">Social</option>
                      <option value="graduation">Graduation</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </>
              )}

              {isLeadership && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem.name}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      name="role"
                      defaultValue={editingItem.role}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded-lg"
                      required={isAdding}
                    />
                    {editingItem.image && !isAdding && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Current Image:</p>
                        <img 
                          src={`${import.meta.env.VITE_API_URL}${editingItem.image}`}
                          alt="Current" 
                          className="h-20 mt-1"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </>
              )}

              {isAbout && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingItem.title}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      rows="4"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {editingItem.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Current Image:</p>
                        <img 
                          src={`${import.meta.env.VITE_API_URL}${editingItem.image}`}
                          alt="Current" 
                          className="h-20 mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Features Section */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    {editingItem.features.map((feature, index) => (
                      <div key={index} className="mb-4 p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = [...editingItem.features];
                              newFeatures.splice(index, 1);
                              setEditingItem({
                                ...editingItem,
                                features: newFeatures
                              });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          name={`features[${index}].title`}
                          defaultValue={feature.title}
                          placeholder="Feature Title"
                          className="w-full px-3 py-2 border rounded-lg mb-2"
                          required
                        />
                        <textarea
                          name={`features[${index}].description`}
                          defaultValue={feature.description}
                          placeholder="Feature Description"
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem({
                          ...editingItem,
                          features: [
                            ...editingItem.features,
                            { title: '', description: '' }
                          ]
                        });
                      }}
                      className="mt-2 flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setIsAdding(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {isAdding ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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
                    _contentType: 'home-slide',
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
                    title: '',
                    description: '',
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
        </div>

        {/* Content Display */}
        {renderContent()}
      </div>

      {/* Edit/Add Modal */}
      {(isEditing || isAdding) && renderEditForm()}
    </div>
  );
};

export default ContentManagement;