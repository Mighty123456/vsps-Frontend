import { useState } from 'react';
import { FaDownload, FaBook, FaLightbulb, FaClipboardList, FaCalendarAlt, FaPalette, FaUtensils, FaMusic } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Resources() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'planning', label: 'Event Planning' },
    { id: 'decoration', label: 'Decoration Ideas' },
    { id: 'checklists', label: 'Checklists' },
    { id: 'guides', label: 'Venue Guides' }
  ];

  const resources = [
    {
      id: 1,
      title: "Complete Wedding Planning Guide",
      description: "A comprehensive guide covering all aspects of wedding planning at our venue.",
      category: "planning",
      icon: FaBook,
      downloadLink: "#",
      type: "PDF Guide",
      size: "2.5 MB"
    },
    {
      id: 2,
      title: "Event Decoration Lookbook",
      description: "Explore our collection of decoration themes and setups for various occasions.",
      category: "decoration",
      icon: FaPalette,
      downloadLink: "#",
      type: "Digital Catalog",
      size: "5.8 MB"
    },
    {
      id: 3,
      title: "Wedding Day Timeline Template",
      description: "Customizable timeline template to help plan your perfect wedding day.",
      category: "checklists",
      icon: FaCalendarAlt,
      downloadLink: "#",
      type: "Excel Template",
      size: "1.2 MB"
    },
    {
      id: 4,
      title: "Corporate Event Planning Checklist",
      description: "Detailed checklist for organizing successful corporate events.",
      category: "checklists",
      icon: FaClipboardList,
      downloadLink: "#",
      type: "PDF Checklist",
      size: "890 KB"
    },
    {
      id: 5,
      title: "Venue Setup Guide",
      description: "Learn about our venue's layout options and setup possibilities.",
      category: "guides",
      icon: FaLightbulb,
      downloadLink: "#",
      type: "Interactive PDF",
      size: "3.2 MB"
    },
    {
      id: 6,
      title: "Catering Menu Planning Guide",
      description: "Tips and guidelines for planning your event's menu and service style.",
      category: "planning",
      icon: FaUtensils,
      downloadLink: "#",
      type: "PDF Guide",
      size: "1.8 MB"
    }
  ];


  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(resource => resource.category === selectedCategory);

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planning Resources</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access our collection of guides, templates, and articles to help plan your perfect event. 
            Everything you need to make your celebration a success.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <resource.icon className="text-2xl text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.type} • {resource.size}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">{resource.description}</p>
              <a
                href={resource.downloadLink}
                className="inline-flex items-center text-purple-600 hover:text-purple-700"
              >
                <FaDownload className="mr-2" />
                Download Resource
              </a>
            </div>
          ))}
        </div>



        {/* Call to Action */}
        <div className="text-center bg-purple-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Personalized Assistance?
          </h3>
          <p className="text-gray-600 mb-6">
            Our event planning experts are here to help you create the perfect event.
          </p>
          <button 
            onClick={handleContactClick}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Contact Our Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default Resources;