import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, FileText, BookOpen, MessageSquare, 
  Plus, Send, Trash2, AlertCircle, Copy, Check, UserPlus, CheckCircle
} from 'lucide-react';
import axios from '../../api/axios';
import AssignmentModal from './AssignmentModal';
import MaterialModal from './MaterialModal';

const BatchDetailsPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');
  const [batch, setBatch] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  
  // Announcement form
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal'
  });

  // Add student form
  const [addStudentForm, setAddStudentForm] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  useEffect(() => {
    if (batchId) {
      fetchBatchDetails();
      fetchAnnouncements();
      fetchMaterials();
      fetchStudentAttendance();
    }
  }, [batchId]);

  const fetchStudentAttendance = async () => {
    try {
      const response = await axios.get(`/batches/${batchId}/attendance`);
      setStudentAttendance(response.data);
    } catch (error) {
      console.error('Error fetching student attendance:', error);
    }
  };

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/batches/${batchId}/details`);
      setBatch(response.data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      alert('Failed to load batch details');
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

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) return;

    try {
      await axios.post('/announcements', {
        batch_id: batchId,
        ...announcementForm
      });
      setAnnouncementForm({ title: '', content: '', priority: 'normal' });
      fetchAnnouncements();
      alert('Announcement posted successfully!');
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to post announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!confirm('Delete this announcement?')) return;
    
    try {
      await axios.delete(`/announcements/${announcementId}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const copyClassCode = () => {
    navigator.clipboard.writeText(batch.class_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddStudent = async () => {
    if (!addStudentForm.trim()) {
      alert('Please enter a roll number or email address');
      return;
    }

    setAddingStudent(true);
    try {
      const response = await axios.post('/enrollments/add-student', {
        batch_id: batchId,
        identifier: addStudentForm.trim()
      });

      alert(response.data.message);
      setAddStudentForm('');
      fetchBatchDetails(); // Refresh to show new student
    } catch (error) {
      console.error('Error adding student:', error);
      alert(error.response?.data?.message || 'Failed to add student');
    } finally {
      setAddingStudent(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'important': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">Batch not found</h3>
        <button
          onClick={() => navigate('/professor/batches')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Batches
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <button
          onClick={() => navigate('/professor/batches')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to My Batches
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {batch.batch_name}
            </h1>
            <div className="flex items-center space-x-3 text-gray-600">
              <span className="font-medium">{batch.course?.course_code}</span>
              <span>•</span>
              <span>Section {batch.section}</span>
              <span>•</span>
              <span>{batch.semester} {batch.academic_year}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Class Code Card */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Class Code</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600 font-mono tracking-wide">
                  {batch.class_code}
                </span>
                <button
                  onClick={copyClassCode}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  {copiedCode ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{batch.stats.total_students}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{batch.stats.pending_enrollments}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{batch.stats.assignments_count}</p>
            <p className="text-sm text-gray-600">Assignments</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <BookOpen className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{batch.stats.materials_count}</p>
            <p className="text-sm text-gray-600">Materials</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4">
            <CheckCircle className="w-8 h-8 text-teal-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{batch.stats.avg_attendance_percentage}%</p>
            <p className="text-sm text-gray-600">Attendance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'stream', label: 'Stream', icon: MessageSquare },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'materials', label: 'Materials', icon: BookOpen },
              { id: 'attendance', label: 'Attendance', icon: CheckCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Stream Tab */}
          {activeTab === 'stream' && (
            <div className="space-y-6">
              {/* Create Announcement Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Post Announcement</h3>
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Announcement Title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <textarea
                    placeholder="Write your announcement..."
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={announcementForm.priority}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Announcements Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Announcements</h3>
                {announcements.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No announcements yet. Post your first one above!</p>
                  </div>
                ) : (
                  announcements.map(announcement => (
                    <div key={announcement.announcement_id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {announcement.professor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{announcement.professor.name}</p>
                            <p className="text-sm text-gray-500">{formatDate(announcement.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                          </span>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement.announcement_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{announcement.title}</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Add Student Section */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add Student
                </h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Enter roll number or email"
                    value={addStudentForm}
                    onChange={(e) => setAddStudentForm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleAddStudent();
                    }}
                    disabled={addingStudent}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAddStudent}
                    disabled={addingStudent}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingStudent ? 'Adding...' : 'Add'}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Students added directly by professor are automatically approved and enrolled in the batch.
                </p>
              </div>

              {/* Students List */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Enrolled Students ({batch.students.length})
                </h3>
                {batch.students.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Roll No</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Program</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {batch.students.map(student => (
                          <tr key={student.roll_number || student.roll_no} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{student.roll_number || student.roll_no}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{student.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{student.program}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {student.enrollment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Assignments</h3>
                <button
                  onClick={() => setShowAssignmentModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Assignment</span>
                </button>
              </div>

              <div className="grid gap-4">
                {materials.filter(m => m.type === 'Assignment').map(assignment => (
                  <div key={assignment.material_id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h4>
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Points: {assignment.total_points}</span>
                          <span>•</span>
                          <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/professor/assignments/${assignment.material_id}/grade`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Grade
                      </button>
                    </div>
                    {assignment.submissions_count !== undefined && (
                      <div className="mt-4 flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          Submissions: {assignment.submissions_count}/{assignment.enrolled_students}
                        </span>
                        <span className="text-green-600">Graded: {assignment.graded_count}</span>
                        <span className="text-orange-600">Unmarked: {assignment.unmarked_count}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Course Materials</h3>
                <button
                  onClick={() => setShowMaterialModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Upload Material</span>
                </button>
              </div>

              <div className="space-y-4">
                {materials.filter(m => m.type !== 'Assignment').map(material => (
                  <div key={material.material_id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{material.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                          {material.topic && (
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {material.topic}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {material.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Student Attendance</h3>
                <div className="text-sm text-gray-600">
                  {studentAttendance.length > 0 && studentAttendance[0].total > 0 && (
                    <span>Total Classes: {studentAttendance[0].total}</span>
                  )}
                </div>
              </div>

              {studentAttendance.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No attendance records yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Classes Attended</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {studentAttendance.map((student) => (
                        <tr key={student.roll_no} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-semibold text-gray-900">{student.roll_no}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{student.name}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-semibold text-gray-900">
                              {student.attended}/{student.total}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                              student.percentage >= 75 
                                ? 'bg-green-100 text-green-800' 
                                : student.percentage >= 60 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        batchId={batchId}
        onSuccess={() => {
          fetchMaterials();
          setActiveTab('assignments');
        }}
      />

      <MaterialModal
        isOpen={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        batchId={batchId}
        onSuccess={() => {
          fetchMaterials();
          setActiveTab('materials');
        }}
      />

      {showMaterialModal && (
        <MaterialModal
          batchId={batchId}
          onClose={() => setShowMaterialModal(false)}
          onSuccess={() => {
            fetchMaterials();
            setActiveTab('materials');
          }}
        />
      )}
    </div>
  );
};

export default BatchDetailsPage;
