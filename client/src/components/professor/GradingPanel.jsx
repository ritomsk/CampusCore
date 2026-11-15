import { useState, useEffect } from 'react';
import { FileText, Search, Award, ChevronDown, ExternalLink } from 'lucide-react';
import axios from '../../api/axios';

const GradingPanel = () => {
  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [filter, setFilter] = useState('all'); // all, unmarked, graded
  const [loading, setLoading] = useState(false);
  const [gradingData, setGradingData] = useState({});

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchAssignments();
    }
  }, [selectedBatch]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions();
    }
  }, [selectedAssignment]);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('/professors/me/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`/materials/batch/${selectedBatch}?type=Assignment`);
      setAssignments(response.data);
      setSelectedAssignment('');
      setSubmissions([]);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/submissions/assignment/${selectedAssignment}`);
      setSubmissions(response.data.submissions);
      
      // Initialize grading data
      const initialGradingData = {};
      response.data.submissions.forEach(sub => {
        initialGradingData[sub.submission_id] = {
          obtained_marks: sub.obtained_marks || '',
          feedback: sub.feedback || ''
        };
      });
      setGradingData(initialGradingData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    const data = gradingData[submissionId];
    
    if (!data.obtained_marks && data.obtained_marks !== 0) {
      alert('Please enter marks');
      return;
    }

    try {
      await axios.patch(`/submissions/${submissionId}/grade`, {
        obtained_marks: parseFloat(data.obtained_marks),
        feedback: data.feedback
      });
      
      alert('Submission graded successfully!');
      fetchSubmissions(); // Refresh
    } catch (error) {
      console.error('Error grading submission:', error);
      alert(error.response?.data?.message || 'Failed to grade submission');
    }
  };

  const updateGradingData = (submissionId, field, value) => {
    setGradingData(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value
      }
    }));
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'unmarked') return sub.status === 'unmarked';
    if (filter === 'graded') return sub.status === 'marked';
    return true;
  });

  const selectedAssignmentData = assignments.find(a => a.material_id === parseInt(selectedAssignment));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Grading Panel</h1>
        <p className="text-gray-600 mt-1">Grade student assignments and provide feedback</p>
      </div>

      {/* Step 1: Select Batch */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Step 1: Select Batch</h2>
        <div className="relative">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">Choose a batch...</option>
            {batches.map(batch => (
              <option key={batch.batch_id} value={batch.batch_id}>
                {batch.batch_name || batch.course_name} - {batch.semester} {batch.academic_year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Step 2: Select Assignment */}
      {selectedBatch && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Step 2: Select Assignment</h2>
          {assignments.length === 0 ? (
            <p className="text-gray-600">No assignments found for this batch</p>
          ) : (
            <div className="relative">
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">Choose an assignment...</option>
                {assignments.map(assignment => (
                  <option key={assignment.material_id} value={assignment.material_id}>
                    {assignment.title} ({assignment.submissions_count || 0} submissions)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          )}
        </div>
      )}

      {/* Step 3: Grade Submissions */}
      {selectedAssignment && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Step 3: Grade Submissions</h2>
              {selectedAssignmentData && (
                <p className="text-sm text-gray-600 mt-1">
                  Total Points: {selectedAssignmentData.total_points} | 
                  Due: {new Date(selectedAssignmentData.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {/* Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setFilter('unmarked')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unmarked' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unmarked ({submissions.filter(s => s.status === 'unmarked').length})
              </button>
              <button
                onClick={() => setFilter('graded')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'graded' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Graded ({submissions.filter(s => s.status === 'marked').length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No submissions to display</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map(submission => (
                <div
                  key={submission.submission_id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-12 gap-6">
                    {/* Student Info */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {submission.student_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{submission.student_name}</p>
                          <p className="text-sm text-gray-600">{submission.roll_no}</p>
                          <p className="text-xs text-gray-500">{submission.program}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <a
                          href={`http://localhost:5000${submission.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Submission</span>
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {new Date(submission.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Grading Section */}
                    <div className="col-span-9">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Marks Input */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Marks Obtained
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={gradingData[submission.submission_id]?.obtained_marks}
                              onChange={(e) => updateGradingData(submission.submission_id, 'obtained_marks', e.target.value)}
                              min="0"
                              max={selectedAssignmentData?.total_points}
                              step="0.5"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                              disabled={submission.status === 'marked'}
                            />
                            <span className="absolute right-3 top-2 text-gray-500">
                              / {selectedAssignmentData?.total_points}
                            </span>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Feedback (Optional)
                          </label>
                          <textarea
                            value={gradingData[submission.submission_id]?.feedback}
                            onChange={(e) => updateGradingData(submission.submission_id, 'feedback', e.target.value)}
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Add comments for the student..."
                            disabled={submission.status === 'marked'}
                          />
                        </div>
                      </div>

                      {/* Action Button / Status */}
                      <div className="mt-4 flex items-center justify-between">
                        {submission.status === 'marked' ? (
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                              <Award className="w-4 h-4" />
                              <span>Graded</span>
                            </span>
                            <span className="text-sm text-gray-600">
                              Graded on {new Date(submission.graded_at).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGradeSubmission(submission.submission_id)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
                          >
                            <Award className="w-4 h-4" />
                            <span>Save Grade</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedBatch && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center">
          <Search className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Batch to Start Grading</h3>
          <p className="text-gray-600">Choose a batch from the dropdown above to view assignments and grade submissions</p>
        </div>
      )}
    </div>
  );
};

export default GradingPanel;
