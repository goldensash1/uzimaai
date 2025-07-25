import React from 'react';
import { useQuery } from 'react-query';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  UsersIcon,
  CubeIcon,
  StarIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  TrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { isAuthenticated, admin } = useAuth();
  
  // Log authentication status
  console.log('Dashboard: Authentication status:', {
    isAuthenticated,
    admin: admin ? {
      username: admin.adminUsername,
      email: admin.adminEmail
    } : null
  });

  const { data: overview, isLoading: overviewLoading, error: overviewError } = useQuery(
    'dashboard-overview',
    dashboardAPI.getOverview,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      onSuccess: (data) => {
        console.log('Dashboard overview data:', data);
      },
      onError: (error) => {
        console.error('Dashboard overview error:', error);
      }
    }
  );

  const { data: recentActivity, isLoading: activityLoading, error: activityError } = useQuery(
    'dashboard-recent-activity',
    dashboardAPI.getRecentActivity,
    {
      refetchInterval: 60000, // Refetch every minute
      onSuccess: (data) => {
        console.log('Recent activity data:', data);
      },
      onError: (error) => {
        console.error('Recent activity error:', error);
      }
    }
  );

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery(
    'dashboard-analytics',
    dashboardAPI.getAnalytics,
    {
      refetchInterval: 300000, // Refetch every 5 minutes
      onSuccess: (data) => {
        console.log('Analytics data:', data);
      },
      onError: (error) => {
        console.error('Analytics error:', error);
      }
    }
  );

  // Debug logging
  console.log('Dashboard component state:', {
    overviewLoading,
    overviewError,
    overview,
    activityLoading,
    activityError,
    recentActivity,
    analyticsLoading,
    analyticsError,
    analytics
  });

  if (overviewLoading || activityLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statsCards = [
    {
      name: 'Total Users',
      value: overview?.users?.total || 0,
      change: overview?.users?.newToday || 0,
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Medicines',
      value: overview?.medicines?.active || 0,
      change: overview?.medicines?.total || 0,
      changeType: 'total',
      icon: CubeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Reviews',
      value: overview?.reviews?.total || 0,
      change: overview?.reviews?.pending || 0,
      changeType: 'pending',
      icon: StarIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Today\'s Searches',
      value: overview?.searches?.today || 0,
      change: overview?.searches?.total || 0,
      changeType: 'total',
      icon: MagnifyingGlassIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Debug Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>Authentication Status: {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}</p>
          <p>Admin User: {admin?.adminUsername || 'None'}</p>
          <p>Admin Email: {admin?.adminEmail || 'None'}</p>
          <p>Overview Loading: {overviewLoading ? 'Yes' : 'No'}</p>
          <p>Overview Error: {overviewError ? overviewError.message : 'None'}</p>
          <p>Overview Data: {overview ? 'Available' : 'Not available'}</p>
          <p>Activity Loading: {activityLoading ? 'Yes' : 'No'}</p>
          <p>Activity Error: {activityError ? activityError.message : 'None'}</p>
          <p>Analytics Loading: {analyticsLoading ? 'Yes' : 'No'}</p>
          <p>Analytics Error: {analyticsError ? analyticsError.message : 'None'}</p>
        </div>
      </div>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your healthcare management system
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                {card.changeType === 'increase' && (
                  <span className="text-green-600 font-medium">
                    +{card.change} today
                  </span>
                )}
                {card.changeType === 'pending' && (
                  <span className="text-yellow-600 font-medium">
                    {card.change} pending
                  </span>
                )}
                {card.changeType === 'total' && (
                  <span className="text-gray-600">
                    {card.change} total
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {/* Recent Users */}
              {recentActivity?.recentUsers?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Users</h4>
                  <div className="space-y-2">
                    {recentActivity.recentUsers.slice(0, 3).map((user) => (
                      <div key={user.userid} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{user.username}</span>
                        <span className={`badge ${user.userstatus === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                          {user.userstatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Medicines */}
              {recentActivity?.recentMedicines?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Medicines</h4>
                  <div className="space-y-2">
                    {recentActivity.recentMedicines.slice(0, 3).map((medicine) => (
                      <div key={medicine.medicineId} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{medicine.medicineName}</span>
                        <span className={`badge ${medicine.medicineStatus === 1 ? 'badge-success' : 'badge-secondary'}`}>
                          {medicine.medicineStatus === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Reviews */}
              {recentActivity?.recentReviews?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Reviews</h4>
                  <div className="space-y-2">
                    {recentActivity.recentReviews.slice(0, 3).map((review) => (
                      <div key={review.riviewId} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-gray-900">{review.username}</span>
                          <span className="text-gray-500 ml-2">on {review.medicineName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-600">★ {review.rating}</span>
                          <span className={`badge ${review.reviewStatus === 1 ? 'badge-success' : 'badge-warning'}`}>
                            {review.reviewStatus === 1 ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="text-lg font-medium text-gray-900">
                  {overview?.reviews?.averageRating?.toFixed(1) || '0.0'} ★
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-lg font-medium text-gray-900">
                  {overview?.users?.active || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Reviews</span>
                <span className="text-lg font-medium text-yellow-600">
                  {overview?.reviews?.pending || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Activity</span>
                <span className="text-lg font-medium text-gray-900">
                  {overview?.activity?.today || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Database: Connected</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">API: Operational</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Authentication: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 