import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { medicinesAPI } from '../services/api';
import { Pill, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Medicines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: medicinesData, isLoading, refetch, error } = useQuery(
    ['medicines', currentPage, searchTerm],
    () => medicinesAPI.getMedicines(currentPage, searchTerm),
    {
      keepPreviousData: true,
    }
  );

  // Debug logging
  console.log('Medicines component - medicinesData:', medicinesData);
  console.log('Medicines component - isLoading:', isLoading);
  console.log('Medicines component - error:', error);
  console.log('Medicines component - localStorage token:', localStorage.getItem('adminToken') ? 'exists' : 'missing');
  console.log('Medicines component - localStorage adminData:', localStorage.getItem('adminData') ? 'exists' : 'missing');

  const handleViewMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const handleStatusChange = async (medicineId, newStatus) => {
    try {
      await medicinesAPI.updateMedicine(medicineId, { medicineStatus: newStatus });
      toast.success('Medicine status updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update medicine status');
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
          <h1 className="text-2xl font-bold text-gray-900">Medicines Management</h1>
          <p className="text-gray-600">Manage all medicines in the database</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <Pill className="w-8 h-8 text-primary" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Medicines</p>
              <p className="text-2xl font-bold text-gray-900">
                {medicinesData?.pagination?.total || 0}
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
              <p className="text-sm font-medium text-gray-600">Active Medicines</p>
              <p className="text-2xl font-bold text-gray-900">
                {medicinesData?.medicines?.filter(m => m.medicineStatus === 1).length || 0}
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
              <p className="text-sm font-medium text-gray-600">Inactive Medicines</p>
              <p className="text-2xl font-bold text-gray-900">
                {medicinesData?.medicines?.filter(m => m.medicineStatus === 0).length || 0}
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
                {medicinesData?.medicines?.length || 0}
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
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Uses</th>
                <th>Side Effects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicinesData?.medicines?.map((medicine) => (
                <tr key={medicine.medicineId}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{medicine.medicineName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-600">
                    <div className="max-w-xs truncate">
                      {medicine.medicineUses}
                    </div>
                  </td>
                  <td className="text-gray-600">
                    <div className="max-w-xs truncate">
                      {medicine.medicineSideEffects}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${medicine.medicineStatus === 1 ? 'badge-success' : 'badge-danger'}`}>
                      {medicine.medicineStatus === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewMedicine(medicine)}
                        className="btn btn-sm btn-outline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-sm btn-outline">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(medicine.medicineId, medicine.medicineStatus === 1 ? 0 : 1)}
                        className={`btn btn-sm ${medicine.medicineStatus === 1 ? 'btn-danger' : 'btn-success'}`}
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
        {medicinesData?.pagination?.total > 10 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, medicinesData.pagination.total)} of {medicinesData.pagination.total} medicines
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
                disabled={currentPage * 10 >= medicinesData.pagination.total}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Medicine Details Modal */}
      {showModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Medicine Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Medicine Name</label>
                <p className="text-gray-900 font-medium">{selectedMedicine.medicineName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Uses</label>
                <p className="text-gray-900">{selectedMedicine.medicineUses}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Side Effects</label>
                <p className="text-gray-900">{selectedMedicine.medicineSideEffects}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Alternatives</label>
                <p className="text-gray-900">{selectedMedicine.medicineAlternatives}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`badge ${selectedMedicine.medicineStatus === 1 ? 'badge-success' : 'badge-danger'}`}>
                  {selectedMedicine.medicineStatus === 1 ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">{selectedMedicine.updatedDate}</p>
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

export default Medicines; 