import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Bell, 
  FileText, 
  Calendar,
  Clock,
  Award,
  Download,
  Paperclip
} from 'lucide-react';
import axios from '../../api/axios';

const BatchViewPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [batchData, setBatchData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState('stream');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatchDetails();
    fetchAnnouncements();
    fetchMaterials();
  }, [batchId]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/batches/${batchId}/details`);
      setBatchData(response.data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      setError(error.response?.data?.message || 'Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`/announcements/batch/${batchId}`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`/materials/batch/${batchId}`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-red-500 mb-4">
          <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Batch</h3>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/student/courses')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (!batchData) {
    return null;
  }

  // Extract data from flat structure
  const batch = {
    batch_id: batchData.batch_id,
    batch_name: batchData.batch_name,
    section: batchData.section,
    class_code: batchData.class_code,
    academic_year: batchData.academic_year,
    semester: batchData.semester,
    status: batchData.status,
    enrollment_mode: batchData.enrollment_mode
  };
  
  const course = batchData.course || {};
  const professor = batchData.professor || {};
  const students = batchData.students || [];
  const teachers = batchData.teachers || [];
  const stats = batchData.stats || {};
  
  // Filter materials to get only assignments
  const assignments = materials.filter(m => m.type === 'Assignment');

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/courses')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </button>

      {/* Batch Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {course.title || course.course_name || 'Unknown Course'} - {batch.batch_name}
            </h1>
            <p className="text-blue-100 mb-4">
              {course.course_code} {batch.section && `• Section ${batch.section}`}
            </p>
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {professor.name}
              </span>
              <span className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {course.credits} Credits
              </span>
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {students.length} Students
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-blue-100 mb-1">Class Code</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{batch.class_code}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['stream', 'students', 'assignments', 'materials'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Stream Tab */}
          {activeTab === 'stream' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Announcements & Updates</h2>
              
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No announcements yet</p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                            <p className="text-sm text-gray-500">
                              Posted by {professor.name} • {new Date(announcement.created_at).toLocaleDateString()} at {new Date(announcement.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Enrolled Students ({students.length})
                </h2>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No students enrolled yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {students.map((student) => (
                    <div
                      key={student.roll_number}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.roll_number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Batch Assignments</h2>
              
              {assignments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No assignments posted yet</p>
                </div>
              ) : (
                assignments.map((assignment) => {
                  const dueDate = new Date(assignment.due_date);
                  const now = new Date();
                  const isOverdue = dueDate < now;
                  const isDueSoon = dueDate < new Date(now.getTime() + 24 * 60 * 60 * 1000);

                  return (
                    <div
                      key={assignment.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                              <p className="text-sm text-gray-600">{assignment.type}</p>
                            </div>
                          </div>
                          
                          {assignment.description && (
                            <p className="text-sm text-gray-700 mb-3 ml-13">{assignment.description}</p>
                          )}

                          <div className="flex items-center space-x-6 text-sm text-gray-600 ml-13">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Posted: {new Date(assignment.posted_date).toLocaleDateString()}
                            </span>
                            <span className={`flex items-center ${isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-orange-600 font-medium' : ''}`}>
                              <Clock className="w-4 h-4 mr-1" />
                              Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center">
                              <Award className="w-4 h-4 mr-1" />
                              {assignment.total_points} points
                            </span>
                          </div>

                          {assignment.topic && (
                            <div className="mt-2 ml-13">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Topic: {assignment.topic}
                              </span>
                            </div>
                          )}

                          {assignment.attachment_url && (
                            <a
                              href={assignment.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 ml-13 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span>View Attachment</span>
                            </a>
                          )}
                        </div>
                        
                        {isOverdue && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Course Materials</h2>
              
              {materials.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No materials uploaded yet</p>
                </div>
              ) : (
                materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{material.title}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-600">{material.type}</span>
                          {material.topic && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-600">Topic: {material.topic}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded on {new Date(material.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchViewPage;
