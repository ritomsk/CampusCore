import { useState, useEffect } from 'react';
import { FileText, Upload, Plus, Eye, Download, CheckCircle, X, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const AssignmentMgmt = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Assignment',
    due_date: '',
    total_points: 100,
    file: null
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchAssignments();
    }
  }, [selectedBatch]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/professors/me/batches');
      setBatches(response.data);
      if (response.data.length > 0) {
        setSelectedBatch(response.data[0].batch_id);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      console.log('Fetching assignments for batch:', selectedBatch);
      const response = await axios.get(`/materials/batch/${selectedBatch}`);
      console.log('Materials fetched:', response.data);
      const assignmentsOnly = response.data.filter(m => m.type === 'Assignment' || m.type === 'assignment');
      setAssignments(assignmentsOnly);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      console.error('Error response:', error.response?.data);
      setAssignments([]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({...formData, file: e.target.files[0]});
    } else {
      setFormData({...formData, [e.target.name]: e.target.value});
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('batch_id', selectedBatch);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('due_date', formData.due_date);
      data.append('total_points', formData.total_points);
      if (formData.file) {
        data.append('file', formData.file);
      }

      await axios.post('/materials', data, {
        headers: {'Content-Type': 'multipart/form-data'}
      });

      await fetchAssignments();
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        type: 'Assignment',
        due_date: '',
        total_points: 100,
        file: null
      });
      alert('Assignment created successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to create assignment: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      setSelectedAssignment(assignment);
      const response = await axios.get(`/submissions/material/${assignment.material_id}`);
      setSubmissions(response.data);
      setShowSubmissionsModal(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      console.error('Error response:', error.response?.data);
      setSubmissions([]);
      setShowSubmissionsModal(true);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assignment Management</h1>
          <p className="text-gray-600 mt-1">Create and manage assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Batch Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Batch
        </label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {batches.map((batch) => (
            <option key={batch.batch_id} value={batch.batch_id}>
              {batch.course_code} - {batch.course_name} (AY {batch.academic_year}, Sem {batch.semester})
            </option>
          ))}
        </select>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assignments Yet</h3>
          <p className="text-gray-600 mb-4">Create your first assignment to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Assignment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.material_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                      {assignment.description && (
                        <p className="text-gray-600 mt-2">{assignment.description}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(assignment.due_date) < new Date()
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {new Date(assignment.due_date) < new Date() ? 'Closed' : 'Active'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Max Points</p>
                        <p className="font-medium">{assignment.total_points || 100}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Upload className="w-4 h-4 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Submissions</p>
                        <p className="font-medium">{assignment.submissions_count || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="font-medium">{new Date(assignment.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200">
                {assignment.file_url && (
                  <a
                    href={assignment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                )}
                <button
                  onClick={() => handleViewSubmissions(assignment)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Submissions</span>
                </button>
                <button
                  onClick={() => navigate(`/professor/assignments/${assignment.material_id}/grade`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Award className="w-4 h-4" />
                  <span>Grade</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Assignment</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Assignment title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Assignment description and instructions..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Points</label>
                  <input
                    type="number"
                    name="total_points"
                    value={formData.total_points}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment File (Optional)
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Submissions: {selectedAssignment.title}</h2>
              <button onClick={() => setShowSubmissionsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div key={submission.submission_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {submission.enrollment?.student?.name?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{submission.enrollment?.student?.name || 'Unknown'}</h4>
                        <p className="text-sm text-gray-600">{submission.enrollment?.student?.roll_no || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {new Date(submission.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {submission.obtained_marks !== null && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {submission.obtained_marks}/{selectedAssignment.total_points || 100}
                        </span>
                      )}
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentMgmt;
