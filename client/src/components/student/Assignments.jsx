import { useState, useEffect } from 'react';
import { FileText, Calendar, Upload, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import axios from '../../api/axios';

const Assignments = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, submitted, graded
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/students/me/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (assignmentId, materialId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('material_id', materialId);

    try {
      setUploadingId(assignmentId);
      await axios.post('/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchAssignments();
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert('Failed to submit assignment');
    } finally {
      setUploadingId(null);
    }
  };

  const getStatusBadge = (assignment) => {
    if (assignment.submission_status === 'graded') {
      return (
        <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4 mr-1" />
          Graded
        </span>
      );
    }
    if (assignment.submission_status === 'submitted') {
      return (
        <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4 mr-1" />
          Submitted
        </span>
      );
    }
    
    const dueDate = new Date(assignment.due_date);
    const today = new Date();
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return (
        <span className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          <AlertCircle className="w-4 h-4 mr-1" />
          Overdue
        </span>
      );
    }
    if (daysLeft <= 2) {
      return (
        <span className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4 mr-1" />
          Due Soon
        </span>
      );
    }
    return (
      <span className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
        <Clock className="w-4 h-4 mr-1" />
        Pending
      </span>
    );
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return assignment.submission_status === 'pending';
    if (filter === 'submitted') return assignment.submission_status === 'submitted';
    if (filter === 'graded') return assignment.submission_status === 'graded';
    return true;
  });

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
        <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Assignments' },
            { key: 'pending', label: 'Pending' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'graded', label: 'Graded' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-800">{assignments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600">
            {assignments.filter(a => a.submission_status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Submitted</p>
          <p className="text-2xl font-bold text-blue-600">
            {assignments.filter(a => a.submission_status === 'submitted').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Graded</p>
          <p className="text-2xl font-bold text-green-600">
            {assignments.filter(a => a.submission_status === 'graded').length}
          </p>
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assignments Found</h3>
          <p className="text-gray-600">There are no assignments matching your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.course_name}</p>
                    </div>
                    {getStatusBadge(assignment)}
                  </div>
                  
                  {assignment.description && (
                    <p className="text-gray-600 mt-3">{assignment.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="font-medium">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Total Points</p>
                    <p className="font-medium">
                      {assignment.total_points || 100} points
                    </p>
                  </div>
                </div>

                {assignment.submission_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Submitted On</p>
                      <p className="font-medium">
                        {new Date(assignment.submission_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Grading Status */}
              {assignment.submission_status === 'graded' && assignment.obtained_marks !== null && (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Grade Received</p>
                      <p className="text-3xl font-bold text-green-600">
                        {assignment.obtained_marks} / {assignment.total_points || 100}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {((assignment.obtained_marks / (assignment.total_points || 100)) * 100).toFixed(1)}%
                      </p>
                    </div>
                    {assignment.graded_at && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Graded on</p>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(assignment.graded_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {assignment.submission_status === 'submitted' && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Awaiting Grading</p>
                      <p className="text-xs text-gray-600">Your professor will review your submission soon</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                {assignment.file_url && (
                  <a
                    href={assignment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Assignment</span>
                  </a>
                )}

                {assignment.submission_status === 'pending' && (
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingId === assignment.id ? 'Uploading...' : 'Submit Assignment'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(
                        assignment.id,
                        assignment.material_id,
                        e.target.files[0]
                      )}
                      disabled={uploadingId === assignment.id}
                    />
                  </label>
                )}

                {assignment.submission_status === 'submitted' && (
                  <span className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>Submitted - Awaiting Grading</span>
                  </span>
                )}

                {assignment.submission_file_url && (
                  <a
                    href={assignment.submission_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Submission</span>
                  </a>
                )}
              </div>

              {assignment.feedback && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Professor Feedback:</p>
                  <p className="text-sm text-gray-600">{assignment.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;
