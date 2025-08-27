import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AddUser() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/admin/users', data);
      toast.success('User created successfully');
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/users"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Add New User</h1>
        </div>
      </div>

      <div className="card max-w-2xl">
        <div className="card-header">
          <h3 className="card-title">User Information</h3>
          <p className="text-sm text-gray-500">
            Fill in the details to create a new user account
          </p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  })}
                  type="text"
                  className="input mt-1"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="useremail" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  {...register('useremail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input mt-1"
                  placeholder="Enter email address"
                />
                {errors.useremail && (
                  <p className="mt-1 text-sm text-red-600">{errors.useremail.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="input mt-1"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="emergencyphone" className="block text-sm font-medium text-gray-700">
                  Emergency Phone
                </label>
                <input
                  {...register('emergencyphone')}
                  type="tel"
                  className="input mt-1"
                  placeholder="Enter emergency phone"
                />
                {errors.emergencyphone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyphone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="userpassword" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  {...register('userpassword', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  type="password"
                  className="input mt-1"
                  placeholder="Enter password"
                />
                {errors.userpassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.userpassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="userstatus" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register('userstatus')}
                  className="input mt-1"
                  defaultValue="active"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.userstatus && (
                  <p className="mt-1 text-sm text-red-600">{errors.userstatus.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/users')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 