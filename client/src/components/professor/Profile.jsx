import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Building, Award } from 'lucide-react';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [professorData, setProfessorData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/professors/me');
      setProfessorData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {professorData?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">{professorData?.name}</h2>
              <p className="text-gray-600 mt-1">{professorData?.email}</p>
              <p className="text-sm text-gray-500 mt-2">{professorData?.prof_id}</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="font-semibold text-gray-800">{professorData?.department}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Office Room</span>
                  <span className="font-semibold text-gray-800">{professorData?.office_room || 'Not assigned'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">Active Batches</span>
                  <span className="font-semibold text-gray-800">{professorData?.active_batches || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{professorData?.name}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <p className="font-medium text-gray-800">{professorData?.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Office Room</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{professorData?.office_room || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Professor ID</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{professorData?.prof_id}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Department</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center">
                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                  <p className="font-medium text-gray-800">{professorData?.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Teaching Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Teaching Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{professorData?.active_batches || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Active Batches</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-purple-600">{professorData?.total_students || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Total Students</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{professorData?.courses_taught || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Courses Taught</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-orange-600">{professorData?.assignments_created || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Assignments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
