import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import axios from '../../api/axios';

const Enrollments = () => {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchEnrollments();
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

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(`/enrollments/batch/${selectedBatch}`);
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      console.error('Error details:', error.response?.data);
      setEnrollments([]);
    }
  };

  const handleApprove = async (enrollmentId) => {
    try {
      setProcessing(enrollmentId);
      await axios.patch(`/enrollments/${enrollmentId}/approve`);
      await fetchEnrollments();
    } catch (error) {
      console.error('Error approving enrollment:', error);
      alert('Failed to approve enrollment');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (enrollmentId) => {
    if (!confirm('Are you sure you want to reject this enrollment?')) return;
    
    try {
      setProcessing(enrollmentId);
      await axios.patch(`/enrollments/${enrollmentId}/reject`);
      await fetchEnrollments();
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
      alert('Failed to reject enrollment');
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkApprove = async () => {
    const pendingEnrollments = filteredEnrollments.filter(e => e.status === 'Pending');
    if (pendingEnrollments.length === 0) {
      alert('No pending enrollments to approve');
      return;
    }

    if (!confirm(`Approve ${pendingEnrollments.length} pending enrollments?`)) return;

    try {
      await Promise.all(
        pendingEnrollments.map(e => axios.patch(`/enrollments/${e.enrollment_id}/approve`))
      );
      await fetchEnrollments();
      alert('All pending enrollments approved!');
    } catch (error) {
      console.error('Error bulk approving:', error);
      alert('Failed to approve some enrollments');
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Map status to lowercase for filter comparison
    const statusLower = enrollment.status?.toLowerCase();
    const matchesFilter = filter === 'all' || statusLower === filter.toLowerCase();
    const matchesSearch = 
      enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.student?.roll_no?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'Pending').length,
    approved: enrollments.filter(e => e.status === 'Approved').length,
    rejected: enrollments.filter(e => e.status === 'Rejected').length
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
        <h1 className="text-3xl font-bold text-gray-800">Enrollment Requests</h1>
        <p className="text-gray-600 mt-1">Review and manage student enrollment requests</p>
      </div>

      {/* Batch Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Batch
        </label>
        <div className="flex space-x-4">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {batches.map((batch) => (
              <option key={batch.batch_id} value={batch.batch_id}>
                {batch.course_code} - {batch.course_name} (AY {batch.academic_year}, Sem {batch.semester})
              </option>
            ))}
          </select>
          {stats.pending > 0 && (
            <button
              onClick={handleBulkApprove}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve All Pending
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {[
              { key: 'pending', label: 'Pending', color: 'orange' },
              { key: 'approved', label: 'Approved', color: 'green' },
              { key: 'rejected', label: 'Rejected', color: 'red' },
              { key: 'all', label: 'All', color: 'gray' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.key
                    ? `bg-${tab.color}-600 text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Enrollments Found</h3>
          <p className="text-gray-600">No enrollment requests match your current filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll Number
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CGPA
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.enrollment_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {enrollment.student?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{enrollment.student?.name}</div>
                          <div className="text-xs text-gray-500">{enrollment.student?.roll_no}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{enrollment.student?.roll_no}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900">{enrollment.student?.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900">Sem {enrollment.student?.semester}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {enrollment.student?.cgpa ? Number(enrollment.student.cgpa).toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === 'Approved' 
                          ? 'bg-green-100 text-green-700'
                          : enrollment.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {enrollment.status === 'Pending' && (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleApprove(enrollment.enrollment_id)}
                            disabled={processing === enrollment.enrollment_id}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(enrollment.enrollment_id)}
                            disabled={processing === enrollment.enrollment_id}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {enrollment.status !== 'Pending' && (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
