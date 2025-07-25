import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { usersAPI } from '../services/api';
import { User, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: usersData, isLoading, refetch, error } = useQuery(
    ['users', currentPage, searchTerm],
    () => usersAPI.getUsers(currentPage, searchTerm),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        console.log('Users data:', data);
      },
      onError: (error) => {
        console.error('Users error:', error);
      }
    }
  );

  // Debug logging
  console.log('Users component state:', {
    isLoading,
    error,
    usersData,
    currentPage,
    searchTerm
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await usersAPI.updateUser(userId, { userstatus: newStatus });
      toast.success('User status updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
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
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage all registered users</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <User className="w-8 h-8 text-primary" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {usersData?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {usersData?.users?.filter(u => u.userstatus === 'active').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {usersData?.users?.filter(u => u.userstatus !== 'active').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {usersData?.users?.length || 0}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData?.users?.map((user) => (
                <tr key={user.userid}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-600">{user.useremail}</td>
                  <td className="text-gray-600">{user.phone}</td>
                  <td>
                    <span className={`badge ${user.userstatus === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {user.userstatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="btn btn-sm btn-outline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-sm btn-outline">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.userid, user.userstatus === 'active' ? 'inactive' : 'active')}
                        className={`btn btn-sm ${user.userstatus === 'active' ? 'btn-danger' : 'btn-success'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData?.total > 10 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, usersData.total)} of {usersData.total} users
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
                disabled={currentPage * 10 >= usersData.total}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{selectedUser.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedUser.useremail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{selectedUser.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Emergency Phone</label>
                <p className="text-gray-900">{selectedUser.emergencyphone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`badge ${selectedUser.userstatus === 'active' ? 'badge-success' : 'badge-danger'}`}>
                  {selectedUser.userstatus}
                </span>
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

export default Users; 