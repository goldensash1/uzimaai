import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function EditMedicine() {
  const [isLoading, setIsLoading] = useState(false);
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  const fetchMedicine = async () => {
    try {
      const response = await api.get(`/admin/medicines/${id}`);
      setMedicine(response.data.medicine);
      reset(response.data.medicine);
    } catch (error) {
      console.error('Error fetching medicine:', error);
      toast.error('Failed to load medicine details');
      navigate('/medicines');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.put(`/admin/medicines/${id}`, data);
      toast.success('Medicine updated successfully');
      navigate('/medicines');
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast.error(error.response?.data?.message || 'Failed to update medicine');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Medicine</h1>
        </div>
        <div className="card max-w-4xl animate-pulse">
          <div className="card-content">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Medicine not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/medicines"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Medicine</h1>
        </div>
      </div>

      <div className="card max-w-4xl">
        <div className="card-header">
          <h3 className="card-title">Edit Medicine Information</h3>
          <p className="text-sm text-gray-500">
            Update the medicine details
          </p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700">
                  Medicine Name *
                </label>
                <input
                  {...register('medicineName', { 
                    required: 'Medicine name is required',
                    minLength: { value: 2, message: 'Medicine name must be at least 2 characters' }
                  })}
                  type="text"
                  className="input mt-1"
                  placeholder="Enter medicine name"
                />
                {errors.medicineName && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicineName.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="medicineUses" className="block text-sm font-medium text-gray-700">
                  Uses/Indications *
                </label>
                <textarea
                  {...register('medicineUses', { 
                    required: 'Medicine uses are required',
                    minLength: { value: 10, message: 'Uses must be at least 10 characters' }
                  })}
                  rows={4}
                  className="input mt-1"
                  placeholder="Describe what this medicine is used for..."
                />
                {errors.medicineUses && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicineUses.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="medicineSideEffects" className="block text-sm font-medium text-gray-700">
                  Side Effects *
                </label>
                <textarea
                  {...register('medicineSideEffects', { 
                    required: 'Side effects are required',
                    minLength: { value: 10, message: 'Side effects must be at least 10 characters' }
                  })}
                  rows={4}
                  className="input mt-1"
                  placeholder="Describe the potential side effects..."
                />
                {errors.medicineSideEffects && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicineSideEffects.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="medicineAlternatives" className="block text-sm font-medium text-gray-700">
                  Alternatives
                </label>
                <textarea
                  {...register('medicineAlternatives')}
                  rows={3}
                  className="input mt-1"
                  placeholder="List alternative medicines (optional)..."
                />
                {errors.medicineAlternatives && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicineAlternatives.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="medicineStatus" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register('medicineStatus')}
                  className="input mt-1"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
                {errors.medicineStatus && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicineStatus.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/medicines')}
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
                {isLoading ? 'Updating...' : 'Update Medicine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 