import { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Award } from 'lucide-react';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/students/me');
      setStudentData(response.data);
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
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {studentData?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">{studentData?.name}</h2>
              <p className="text-gray-600 mt-1">{studentData?.email}</p>
              <p className="text-sm text-gray-500 mt-2">{studentData?.roll_no}</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="font-semibold text-gray-800">{studentData?.department}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Program</span>
                  <span className="font-semibold text-gray-800">{studentData?.program}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">CGPA</span>
                  <span className="font-semibold text-gray-800">{studentData?.cgpa ? Number(studentData.cgpa).toFixed(2) : '0.00'}</span>
                </div>
                {studentData?.backlogs !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">Backlogs</span>
                    <span className="font-semibold text-gray-800">{studentData.backlogs}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    studentData?.status === 'Active' ? 'text-green-600' : 'text-orange-600'
                  }`}>{studentData?.status}</span>
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
                  <p className="font-medium text-gray-800">{studentData?.name}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <p className="font-medium text-gray-800">{studentData?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Roll Number</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{studentData?.roll_no}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Batch</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{studentData?.batch_name || 'Not enrolled'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Department</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{studentData?.department}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Program</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{studentData?.program}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Current Semester</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">Semester {studentData?.semester || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">CGPA</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  <p className="font-bold text-gray-800">{studentData?.cgpa ? Number(studentData.cgpa).toFixed(2) : '0.00'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Backlogs</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{studentData?.backlogs || 0}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    studentData?.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {studentData?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
