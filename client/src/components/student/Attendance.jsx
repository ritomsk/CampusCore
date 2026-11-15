import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import axios from '../../api/axios';

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/students/me/attendance/recent');
      setAttendanceRecords(response.data || []);
      
      // Calculate summary
      const total = response.data.length;
      const present = response.data.filter(r => r.status === 'present').length;
      const absent = response.data.filter(r => r.status === 'absent').length;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
      
      setSummary({
        totalClasses: total,
        present,
        absent,
        percentage: parseFloat(percentage)
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const courses = [...new Set(attendanceRecords.map(r => r.course_name))];
  
  const filteredRecords = selectedCourse === 'all' 
    ? attendanceRecords 
    : attendanceRecords.filter(r => r.course_name === selectedCourse);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'absent':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`;
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
        <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Attendance %</p>
            <TrendingUp className="w-6 h-6 text-blue-100" />
          </div>
          <p className="text-4xl font-bold">{summary.percentage}%</p>
          <p className="text-sm text-blue-100 mt-2">
            {summary.percentage >= 75 ? 'Good Standing' : 'Below Requirement'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Total Classes</p>
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{summary.totalClasses}</p>
          <p className="text-sm text-gray-500 mt-2">Sessions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Present</p>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{summary.present}</p>
          <p className="text-sm text-gray-500 mt-2">Classes</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Absent</p>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{summary.absent}</p>
          <p className="text-sm text-gray-500 mt-2">Classes</p>
        </div>
      </div>

      {/* Warning if below 75% */}
      {summary.percentage < 75 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Attendance Warning</h3>
            <p className="text-sm text-red-700 mt-1">
              Your attendance is below the required 75%. You need to attend more classes to meet the minimum requirement.
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Records */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Attendance Records</h3>
          <p className="text-gray-600">Your attendance records will appear here once classes begin.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic Covered
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(record.session_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{record.course_name}</div>
                      <div className="text-xs text-gray-500">{record.course_code || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{record.topic_covered || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className={getStatusBadge(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Policy */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Attendance Policy</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Minimum 75% attendance is required to be eligible for end-semester exams</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Attendance;
