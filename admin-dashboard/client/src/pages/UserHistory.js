import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { historyAPI } from '../services/api';
import { Activity, User, Clock, TrendingUp } from 'lucide-react';

const UserHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: historyData, isLoading } = useQuery(
    ['userHistory', currentPage, searchTerm],
    () => historyAPI.getUserHistory(currentPage, searchTerm),
    {
      keepPreviousData: true,
    }
  );

  const { data: historyStats } = useQuery(
    ['historyStats'],
    () => historyAPI.getHistoryStats(),
    {
      keepPreviousData: true,
    }
  );

  const handleViewHistory = (history) => {
    setSelectedHistory(history);
    setShowModal(true);
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'login':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'search':
        return <Activity className="w-4 h-4 text-green-600" />;
      case 'review':
        return <Activity className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Activity History</h1>
          <p className="text-gray-600">Monitor user activities and interactions</p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-primary" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyStats?.totalActivities || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <User className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyStats?.uniqueUsers || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyStats?.todayActivities || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyStats?.weekActivities || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User History Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Action Type</th>
                <th>Action Content</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyData?.activities?.map((activity) => (
                <tr key={activity.historyId}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {activity.userId}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">User #{activity.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      {getActionIcon(activity.actionType)}
                      <span className="ml-2 text-gray-600 capitalize">{activity.actionType}</span>
                    </div>
                  </td>
                  <td className="text-gray-600">
                    <div className="max-w-xs truncate">
                      {activity.actionContent}
                    </div>
                  </td>
                  <td className="text-gray-600">
                    {new Date(activity.actionTime).toLocaleString()}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewHistory(activity)}
                        className="btn btn-sm btn-outline"
                      >
                        <Activity className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {historyData?.total > 10 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, historyData.total)} of {historyData.total} activities
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * 10 >= historyData.total}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Details Modal */}
      {showModal && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Activity Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">User ID</label>
                <p className="text-gray-900">{selectedHistory.userId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Action Type</label>
                <div className="flex items-center">
                  {getActionIcon(selectedHistory.actionType)}
                  <span className="ml-2 text-gray-900 capitalize">{selectedHistory.actionType}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Action Content</label>
                <p className="text-gray-900">{selectedHistory.actionContent}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Action Time</label>
                <p className="text-gray-900">{new Date(selectedHistory.actionTime).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistory; 