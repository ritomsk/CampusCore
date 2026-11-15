import { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, FileText, Download, ExternalLink, ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const MyCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  
  // Semester filter state - will be set from system settings
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentSemester, setCurrentSemester] = useState({ semester: '', academic_year: '' });

  useEffect(() => {
    fetchCurrentSemester();
  }, []);

  useEffect(() => {
    if (selectedSemester && selectedYear) {
      fetchCourses();
    }
  }, [selectedSemester, selectedYear]);

  const fetchCurrentSemester = async () => {
    try {
      const response = await axios.get('/settings/current-semester');
      setCurrentSemester(response.data);
      setSelectedSemester(response.data.semester);
      setSelectedYear(response.data.academic_year);
    } catch (error) {
      console.error('Error fetching current semester:', error);
      // Fallback to defaults if settings not available
      setSelectedSemester('Autumn');
      setSelectedYear('2026');
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/students/me/courses', {
        params: {
          semester: selectedSemester,
          academic_year: selectedYear,
          status: 'Active'
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleViewBatch = (batchId) => {
    navigate(`/student/batch/${batchId}`);
  };

  const handleJoinWithCode = async (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    
    if (!classCode.trim()) {
      setJoinError('Please enter a class code');
      return;
    }

    try {
      setJoinLoading(true);
      const response = await axios.post('/enrollments/join-with-code', {
        class_code: classCode.trim().toUpperCase()
      });
      
      setJoinSuccess(response.data.message || 'Successfully joined the batch!');
      setClassCode('');
      
      // Refresh courses list
      setTimeout(() => {
        fetchCourses();
        setShowJoinModal(false);
        setJoinSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error joining with class code:', error);
      setJoinError(error.response?.data?.message || 'Failed to join batch. Please check the code and try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Course List View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
        <button
          onClick={() => setShowJoinModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Join with Class Code</span>
        </button>
      </div>

      {/* Semester Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Autumn">Autumn</option>
            <option value="Spring">Spring</option>
          </select>
          
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          
          <div className="flex-1"></div>
          
          <div className="text-sm text-gray-600">
            Showing: <span className="font-semibold text-gray-800">{selectedSemester} {selectedYear}</span>
            {currentSemester.semester === selectedSemester && currentSemester.academic_year === selectedYear && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Current Semester
              </span>
            )}
            {courses.length > 0 && <span className="ml-2">({courses.length} course{courses.length !== 1 ? 's' : ''})</span>}
          </div>
        </div>
      </div>

      {/* Join with Class Code Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Join with Class Code</h2>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setClassCode('');
                  setJoinError('');
                  setJoinSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleJoinWithCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Code
                </label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder="Enter 8-character code (e.g., XK7P2M9Q)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider"
                  maxLength={8}
                  disabled={joinLoading}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ask your professor for the class code
                </p>
              </div>

              {joinError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{joinError}</p>
                </div>
              )}

              {joinSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{joinSuccess}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setClassCode('');
                    setJoinError('');
                    setJoinSuccess('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={joinLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={joinLoading || !classCode.trim()}
                >
                  {joinLoading ? 'Joining...' : 'Join Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Enrolled</h3>
          <p className="text-gray-600">You are not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleViewBatch(course.batch_id)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{course.course_name}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.course_code}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {course.professor_name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {course.credits} Credits
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {course.semester} {course.academic_year}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Attendance</p>
                    <p className={`text-lg font-bold ${
                      course.attendance_percentage >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {course.attendance_percentage}%
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
