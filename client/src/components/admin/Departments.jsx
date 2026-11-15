import { useState, useEffect } from 'react';
import { Building, Users, BookOpen, Award, Briefcase, TrendingUp } from 'lucide-react';
import axios from '../../api/axios';

const Departments = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
        <p className="text-gray-600 mt-1">Overview of all academic departments</p>
      </div>

      {/* Department Cards */}
      {departments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Departments Found</h3>
          <p className="text-gray-600">Department data will appear here once available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Card Header */}
              <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <Building className="w-16 h-16 text-white opacity-80" />
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{dept.department}</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Students</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{dept.student_count}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Professors</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{dept.professor_count}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Courses</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{dept.course_count}</p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm text-gray-600">Placements</span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{dept.placement_count || 0}</p>
                  </div>
                </div>

                {/* Additional Metrics */}
                {dept.avg_package && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">Average Package</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        ₹{(dept.avg_package / 100000).toFixed(2)} LPA
                      </span>
                    </div>
                  </div>
                )}

                {dept.student_count > 0 && dept.professor_count > 0 && (
                  <div className="pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Student-Faculty Ratio</span>
                      <span className="text-lg font-semibold text-gray-800">
                        {Math.round(dept.student_count / dept.professor_count)}:1
                      </span>
                    </div>
                  </div>
                )}

                {dept.placement_count > 0 && dept.student_count > 0 && (
                  <div className="pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Placement Rate</span>
                      <span className="text-lg font-semibold text-indigo-600">
                        {Math.round((dept.placement_count / dept.student_count) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-indigo-100 rounded-full h-2 mt-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(Math.round((dept.placement_count / dept.student_count) * 100), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {departments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Institution Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Departments</p>
              <p className="text-3xl font-bold text-blue-600">{departments.length}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-purple-600">
                {departments.reduce((sum, d) => sum + d.student_count, 0)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Professors</p>
              <p className="text-3xl font-bold text-green-600">
                {departments.reduce((sum, d) => sum + d.professor_count, 0)}
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-indigo-600">
                {departments.reduce((sum, d) => sum + d.course_count, 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
