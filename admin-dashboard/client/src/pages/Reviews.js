import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { reviewsAPI } from '../services/api';
import { MessageSquare, Search, Check, X, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: reviewsData, isLoading, refetch } = useQuery(
    ['reviews', currentPage, searchTerm, statusFilter],
    () => reviewsAPI.getReviews(currentPage, searchTerm, statusFilter),
    {
      keepPreviousData: true,
    }
  );

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await reviewsAPI.updateReviewStatus(reviewId, newStatus);
      toast.success('Review status updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600">Manage and moderate medicine reviews</p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-primary" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviewsData?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviewsData?.reviews?.filter(r => r.reviewStatus === 1).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviewsData?.reviews?.filter(r => r.reviewStatus === 0).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviewsData?.reviews?.length > 0 
                  ? (reviewsData.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsData.reviews.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Reviews</option>
            <option value="1">Approved</option>
            <option value="0">Pending</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Medicine</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewsData?.reviews?.map((review) => (
                <tr key={review.riviewId}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {review.UserId}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">User #{review.UserId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-600">
                    Medicine #{review.medicineId}
                  </td>
                  <td className="text-gray-600">
                    <div className="max-w-xs truncate">
                      {review.ReviewMessage}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${review.reviewStatus === 1 ? 'badge-success' : 'badge-warning'}`}>
                      {review.reviewStatus === 1 ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewReview(review)}
                        className="btn btn-sm btn-outline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {review.reviewStatus === 0 && (
                        <button
                          onClick={() => handleStatusChange(review.riviewId, 1)}
                          className="btn btn-sm btn-success"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {review.reviewStatus === 1 && (
                        <button
                          onClick={() => handleStatusChange(review.riviewId, 0)}
                          className="btn btn-sm btn-warning"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {reviewsData?.total > 10 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, reviewsData.total)} of {reviewsData.total} reviews
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
                disabled={currentPage * 10 >= reviewsData.total}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Review Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">User ID</label>
                <p className="text-gray-900">{selectedReview.UserId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Medicine ID</label>
                <p className="text-gray-900">{selectedReview.medicineId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Rating</label>
                <div className="flex items-center">
                  {renderStars(selectedReview.rating)}
                  <span className="ml-2 text-gray-900">({selectedReview.rating}/5)</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Review Message</label>
                <p className="text-gray-900">{selectedReview.ReviewMessage}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`badge ${selectedReview.reviewStatus === 1 ? 'badge-success' : 'badge-warning'}`}>
                  {selectedReview.reviewStatus === 1 ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Review Date</label>
                <p className="text-gray-900">{selectedReview.reviewDate}</p>
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

export default Reviews; 