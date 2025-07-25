import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { searchAPI } from '../services/api';
import { Search, TrendingUp, Clock, User } from 'lucide-react';

const SearchHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: searchData, isLoading } = useQuery(
    ['searchHistory', currentPage, searchTerm],
    () => searchAPI.getSearchHistory(currentPage, searchTerm),
    {
      keepPreviousData: true,
    }
  );

  const { data: searchStats } = useQuery(
    ['searchStats'],
    () => searchAPI.getSearchStats(),
    {
      keepPreviousData: true,
    }
  );

  const handleViewSearch = (search) => {
    setSelectedSearch(search);
    setShowModal(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Search History</h1>
          <p className="text-gray-600">Monitor user search patterns and trends</p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <Search className="w-8 h-8 text-primary" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Searches</p>
              <p className="text-2xl font-bold text-gray-900">
                {searchStats?.totalSearches || 0}
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
                {searchStats?.uniqueUsers || 0}
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
                {searchStats?.todaySearches || 0}
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
                {searchStats?.weekSearches || 0}
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
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search History Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Search Content</th>
                <th>Search Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchData?.searches?.map((search) => (
                <tr key={search.searchId}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {search.userid}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">User #{search.userid}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-600">
                    <div className="max-w-xs">
                      {search.searchContent}
                    </div>
                  </td>
                  <td className="text-gray-600">
                    {new Date(search.searchTime).toLocaleString()}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewSearch(search)}
                        className="btn btn-sm btn-outline"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {searchData?.total > 10 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, searchData.total)} of {searchData.total} searches
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
                disabled={currentPage * 10 >= searchData.total}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Details Modal */}
      {showModal && selectedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Search Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">User ID</label>
                <p className="text-gray-900">{selectedSearch.userid}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Search Content</label>
                <p className="text-gray-900">{selectedSearch.searchContent}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Search Time</label>
                <p className="text-gray-900">{new Date(selectedSearch.searchTime).toLocaleString()}</p>
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

export default SearchHistory; 