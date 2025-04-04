import { useState } from 'react';
import { FaPlay, FaCalendarAlt, FaClock, FaUsers, FaShare, FaHeart } from 'react-icons/fa';

function LiveStreaming() {
  const [activeTab, setActiveTab] = useState('live');

  const liveEvents = [
    {
      id: 1,
      title: "Kumar Wedding Ceremony",
      description: "Live streaming of the wedding ceremony from the Grand Hall",
      thumbnail: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
      viewers: 245,
      startTime: "10:00 AM",
      streamUrl: "#",
      likes: 156
    }
  ];

  const upcomingEvents = [
    {
      id: 2,
      title: "Mehta Family Reception",
      description: "Join us for the grand celebration",
      thumbnail: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
      date: "2024-04-15",
      time: "6:00 PM",
      streamUrl: "#"
    },
    {
      id: 3,
      title: "Annual Corporate Awards",
      description: "Tech Innovations Ltd. annual awards ceremony",
      thumbnail: "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
      date: "2024-04-20",
      time: "7:00 PM",
      streamUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1505236858219-8359eb29e329"
          alt="Live Streaming"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-600/90">
          <div className="container mx-auto h-full flex items-center px-4">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Live Event Streaming</h1>
              <p className="text-lg opacity-90">
                Experience our events from anywhere in the world. Watch live streams of ongoing events
                or set reminders for upcoming broadcasts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeTab === 'live'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            Live Now
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            Upcoming Streams
          </button>
        </div>

        {/* Live Events Section */}
        {activeTab === 'live' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Events</h2>
            {liveEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {liveEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-red-600 text-white rounded-full flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                          LIVE
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="px-3 py-1 bg-black/70 text-white rounded-full flex items-center">
                          <FaUsers className="mr-2" />
                          {event.viewers} watching
                        </span>
                      </div>
                      <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                          <FaPlay className="text-white text-2xl ml-1" />
                        </div>
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-full">
                            <FaShare className="text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-full">
                            <FaHeart className="text-red-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Started at {event.startTime}
                        </span>
                        <a
                          href={event.streamUrl}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Join Stream
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <FaPlay className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No live events at the moment</p>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Events Section */}
        {activeTab === 'upcoming' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Streams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FaClock className="mr-2" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <button className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Set Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Watch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlay className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Join Stream</h3>
              <p className="text-gray-600">Click the 'Join Stream' button on any live event to start watching</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShare className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Event</h3>
              <p className="text-gray-600">Share the stream link with friends and family to watch together</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Set Reminders</h3>
              <p className="text-gray-600">Never miss an event by setting reminders for upcoming streams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveStreaming;