import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  VideoCameraIcon, 
  CalendarIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
];

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '0', icon: UsersIcon, color: 'bg-blue-500' },
    { title: 'Active Streams', value: '0', icon: VideoCameraIcon, color: 'bg-green-500' },
    { title: 'Bookings', value: '0', icon: CalendarIcon, color: 'bg-yellow-500' },
    { title: 'Revenue', value: 'Rs0', icon: CurrencyDollarIcon, color: 'bg-purple-500' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await axiosInstance.get('/api/users/dashboard-stats');
      const { totalUsers, totalBookings, activeStreams, totalRevenue } = response.data;

      setStats([
        { title: 'Total Users', value: totalUsers.toString(), icon: UsersIcon, color: 'bg-blue-500' },
        { title: 'Active Streams', value: activeStreams.toString(), icon: VideoCameraIcon, color: 'bg-green-500' },
        { title: 'Bookings', value: totalBookings.toString(), icon: CalendarIcon, color: 'bg-yellow-500' },
        { title: 'Revenue', value: `Rs${totalRevenue.toLocaleString()}`, icon: CurrencyDollarIcon, color: 'bg-purple-500' },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate('/auth');
      } else {
        setError('Failed to load dashboard statistics');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#9333ea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;