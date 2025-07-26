import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Pill, MessageSquare, Search, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="card">
    <div className="card-content">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          {changeType === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`ml-1 text-sm font-medium ${
            changeType === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
        </div>
      )}
    </div>
  </div>
);

const COLORS = ['#2563eb', '#22c55e', '#f59e42', '#ef4444', '#a21caf'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMedicines: 0,
    totalReviews: 0,
    totalSearches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userStatusData, setUserStatusData] = useState([
    { name: 'Active', value: 0 },
    { name: 'Inactive', value: 0 },
  ]);
  const [medicineStatusData, setMedicineStatusData] = useState([
    { name: 'Active', value: 0 },
    { name: 'Inactive', value: 0 },
  ]);
  const navigate = useNavigate();

  // Mock trend data for bar chart
  const trendData = [
    { name: 'Mon', Users: 10, Medicines: 5, Reviews: 2, Searches: 8 },
    { name: 'Tue', Users: 12, Medicines: 6, Reviews: 3, Searches: 10 },
    { name: 'Wed', Users: 14, Medicines: 7, Reviews: 4, Searches: 12 },
    { name: 'Thu', Users: 16, Medicines: 8, Reviews: 5, Searches: 14 },
    { name: 'Fri', Users: 18, Medicines: 9, Reviews: 6, Searches: 16 },
    { name: 'Sat', Users: 20, Medicines: 10, Reviews: 7, Searches: 18 },
    { name: 'Sun', Users: 22, Medicines: 11, Reviews: 8, Searches: 20 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, medicinesRes, reviewsRes, searchesRes] = await Promise.all([
          api.get('/admin/users/count'),
          api.get('/admin/medicines/count'),
          api.get('/admin/reviews/count'),
          api.get('/admin/search-history/count'),
        ]);

        setStats({
          totalUsers: usersRes.data.count || 0,
          totalMedicines: medicinesRes.data.count || 0,
          totalReviews: reviewsRes.data.count || 0,
          totalSearches: searchesRes.data.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    // Fetch user/medicine status for pie charts
    const fetchStatusData = async () => {
      try {
        const usersRes = await api.get('/admin/users');
        const medicinesRes = await api.get('/admin/medicines');
        const users = usersRes.data.users || [];
        const medicines = medicinesRes.data.medicines || [];
        const activeUsers = users.filter(u => u.userstatus === 'active').length;
        const inactiveUsers = users.filter(u => u.userstatus === 'inactive').length;
        setUserStatusData([
          { name: 'Active', value: activeUsers },
          { name: 'Inactive', value: inactiveUsers },
        ]);
        const activeMeds = medicines.filter(m => m.medicineStatus === 1 || m.medicineStatus === '1').length;
        const inactiveMeds = medicines.filter(m => m.medicineStatus === 0 || m.medicineStatus === '0').length;
        setMedicineStatusData([
          { name: 'Active', value: activeMeds },
          { name: 'Inactive', value: inactiveMeds },
        ]);
      } catch (error) {
        // fallback: keep pie chart at 0
      }
    };

    fetchStats();
    fetchStatusData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome to UzimaAI Admin Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          change="+12%"
          changeType="up"
        />
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          icon={Pill}
          change="+5%"
          changeType="up"
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={MessageSquare}
          change="+8%"
          changeType="up"
        />
        <StatCard
          title="Total Searches"
          value={stats.totalSearches}
          icon={Search}
          change="+15%"
          changeType="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">New user registered</p>
                <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Medicine added to database</p>
                <span className="text-xs text-gray-400 ml-auto">5 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm text-gray-600">New review submitted</p>
                <span className="text-xs text-gray-400 ml-auto">10 min ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <button className="w-full btn btn-primary" onClick={() => navigate('/add-user')}>
                Add New User
              </button>
              <button className="w-full btn btn-secondary" onClick={() => navigate('/add-medicine')}>
                Add New Medicine
              </button>
              <button className="w-full btn btn-secondary" onClick={() => navigate('/reviews')}>
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Trends</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Users" fill="#2563eb" />
                <Bar dataKey="Medicines" fill="#22c55e" />
                <Bar dataKey="Reviews" fill="#f59e42" />
                <Bar dataKey="Searches" fill="#a21caf" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User & Medicine Status</h3>
          </div>
          <div className="card-content flex flex-col md:flex-row items-center justify-center gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 text-center mb-2">User Status</h4>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={userStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                    {userStatusData.map((entry, idx) => (
                      <Cell key={`cell-user-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 text-center mb-2">Medicine Status</h4>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={medicineStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                    {medicineStatusData.map((entry, idx) => (
                      <Cell key={`cell-med-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 