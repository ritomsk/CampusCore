import { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Plus, Trash2, Copy, Check, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import CreateBatchModal from './CreateBatchModal';

const MyBatches = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  
  // Semester filter state
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentSemester, setCurrentSemester] = useState({ semester: '', academic_year: '' });

  useEffect(() => {
    fetchCurrentSemester();
  }, []);

  useEffect(() => {
    if (selectedSemester && selectedYear) {
      fetchBatches();
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
      // Fallback to defaults
      setSelectedSemester('Autumn');
      setSelectedYear('2026');
    }
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/professors/me/batches', {
        params: {
          semester: selectedSemester,
          academic_year: selectedYear
        }
      });
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchCreated = () => {
    fetchBatches();
  };

  const copyClassCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteBatch = async (batchId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`/batches/${batchId}`);
      await fetchBatches();
      alert('Batch deleted successfully!');
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Failed to delete batch');
    }
  };

  const getEnrollmentModeColor = (mode) => {
    switch(mode) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'invite_only': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getEnrollmentModeLabel = (mode) => {
    switch(mode) {
      case 'open': return 'Open';
      case 'invite_only': return 'Invite Only';
      default: return 'Request';
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
          <h1 className="text-3xl font-bold text-gray-800">My Batches</h1>
          <p className="text-gray-600 mt-1">Manage your course batches and students</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Create Batch</span>
        </button>
      </div>

      {/* Semester Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter by Semester</h3>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Semester:</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Autumn">Autumn</option>
                <option value="Spring">Spring</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            {/* Current Semester Badge */}
            {selectedSemester === currentSemester.semester && 
             selectedYear === currentSemester.academic_year && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Current Semester
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Batches Grid */}
      {batches.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <BookOpen className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Batches Yet</h3>
          <p className="text-gray-600 mb-6">Create your first batch to get started teaching</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Create First Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch.batch_id}
              onClick={() => navigate(`/professor/batches/${batch.batch_id}`)}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
            >
              {/* Card Header with Gradient */}
              <div className="h-32 bg-gradient-to-br from-purple-500 via-blue-600 to-blue-700 flex items-center justify-center relative">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
                {/* Enrollment Mode Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getEnrollmentModeColor(batch.enrollment_mode)}`}>
                  {getEnrollmentModeLabel(batch.enrollment_mode)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Batch Name or Course Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">
                  {batch.batch_name || batch.course_name}
                </h3>
                
                {/* Course Code and Section */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-gray-600">{batch.course_code}</span>
                  {batch.section && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm font-medium text-blue-600">Section {batch.section}</span>
                    </>
                  )}
                </div>
                
                {/* Class Code */}
                {batch.class_code && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Class Code</p>
                      <p className="text-lg font-bold text-blue-600 font-mono tracking-wide">
                        {batch.class_code}
                      </p>
                    </div>
                    <button
                      onClick={(e) => copyClassCode(batch.class_code, e)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Copy class code"
                    >
                      {copiedCode === batch.class_code ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{batch.semester} {batch.academic_year}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{batch.enrolled_count || 0} Students Enrolled</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Pending</p>
                    <p className="text-lg font-bold text-orange-600">{batch.pending_count || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Materials</p>
                    <p className="text-lg font-bold text-blue-600">{batch.materials_count || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Sessions</p>
                    <p className="text-lg font-bold text-purple-600">{batch.sessions_count || 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/professor/batches/${batch.batch_id}`);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => handleDeleteBatch(batch.batch_id, e)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      <CreateBatchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleBatchCreated}
      />
    </div>
  );
};

export default MyBatches;
