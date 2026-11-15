import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Save } from 'lucide-react';
import axios from '../../api/axios';

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchStudents();
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

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`/enrollments/batch/${selectedBatch}`);
      
      if (!response.data || response.data.length === 0) {
        console.log('No enrollments found for this batch');
        setStudents([]);
        setAttendance({});
        return;
      }
      
      const approvedStudents = response.data.filter(e => e.status === 'Approved');
      
      if (approvedStudents.length === 0) {
        console.log('No approved students found');
        setStudents([]);
        setAttendance({});
        return;
      }
      
      // Map to correct field names from database
      const studentData = approvedStudents
        .filter(enrollment => enrollment.student) // Filter out any without student data
        .map(enrollment => ({
          roll_no: enrollment.student.roll_no,
          name: enrollment.student.name,
          department: enrollment.student.department,
          semester: enrollment.student.semester,
          program: enrollment.student.program
        }))
        .sort((a, b) => a.roll_no.localeCompare(b.roll_no)); // Sort by roll number
      
      setStudents(studentData);
      
      // Initialize attendance with 'present' for all students
      const initialAttendance = {};
      studentData.forEach(student => {
        initialAttendance[student.roll_no] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
      console.error('Error details:', error.response?.data || error.message);
      setStudents([]);
      setAttendance({});
    }
  };

  const handleAttendanceChange = (rollNo, status) => {
    setAttendance({
      ...attendance,
      [rollNo]: status
    });
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.roll_no] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for this session');
      return;
    }

    try {
      setSaving(true);

      // Create new session first
      const sessionResponse = await axios.post('/sessions', {
        batch_id: selectedBatch,
        session_date: sessionDate,
        topic: topic
      });

      const sessionId = sessionResponse.data.session.session_id;

      // Save attendance for the new session
      const attendanceData = Object.entries(attendance).map(([rollNumber, status]) => ({
        roll_no: rollNumber,
        status: status.charAt(0).toUpperCase() + status.slice(1) // Capitalize: Present, Absent
      }));

      await axios.post('/attendance/bulk', {
        session_id: sessionId,
        records: attendanceData
      });

      alert('Session created and attendance saved successfully!');
      
      // Reset form
      setTopic('');
      setSessionDate(new Date().toISOString().split('T')[0]);
      
      // Re-initialize attendance to all present
      const initialAttendance = {};
      students.forEach(student => {
        initialAttendance[student.roll_no] = 'present';
      });
      setAttendance(initialAttendance);
      
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    total: students.length
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
        <h1 className="text-3xl font-bold text-gray-800">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">Create a new session and record student attendance</p>
      </div>

      {/* Session Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
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
                  {batch.course_code} - {batch.course_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Date
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic Covered <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., SQL Joins and Subqueries"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {selectedBatch && students.length > 0 && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMarkAll('present')}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('absent')}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  Mark All Absent
                </button>
              </div>
              <button
                onClick={handleSaveAttendance}
                disabled={saving || !topic.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
              </button>
            </div>
          </div>

          {/* Attendance List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.roll_no} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{student.roll_no}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="ml-3 text-sm text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-600">{student.department}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-600">Sem {student.semester}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleAttendanceChange(student.roll_no, 'present')}
                            className={`p-2 rounded-lg transition-colors ${
                              attendance[student.roll_no] === 'present'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                            }`}
                            title="Present"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(student.roll_no, 'absent')}
                            className={`p-2 rounded-lg transition-colors ${
                              attendance[student.roll_no] === 'absent'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                            }`}
                            title="Absent"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;
