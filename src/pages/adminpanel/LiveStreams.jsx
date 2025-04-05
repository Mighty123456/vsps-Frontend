import { useState } from 'react';
import { SignalIcon, EyeIcon } from '@heroicons/react/24/outline';

const LiveStreams = () => {
  const [streams] = useState([
    { 
      id: 1, 
      title: ' Session 1',
      host: 'Ansh Parikh',
      viewers: 156,
      status: 'Live',
      duration: '45:23'
    },

  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Live Streams</h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div key={stream.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 h-48 relative">
                {stream.status === 'Live' && (
                  <div className="absolute top-4 left-4 flex items-center bg-red-500 text-white px-2 py-1 rounded-full">
                    <SignalIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Live</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{stream.title}</h3>
                <p className="text-gray-500 text-sm mt-1">Host: {stream.host}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <EyeIcon className="h-5 w-5 mr-1" />
                    <span>{stream.viewers}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    stream.status === 'Live' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {stream.status === 'Live' ? stream.duration : stream.startTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveStreams;