import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react';
import StatCard from '../common/StatCard';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cgpa: 0,
    enrolledCourses: 0,
    attendancePercentage: 0,
    assignmentsDue: 0
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch student stats
      const statsRes = await axios.get('/students/me/stats');
      setStats(statsRes.data || {
        cgpa: 0,
        enrolledCourses: 0,
        attendancePercentage: 0,
        assignmentsDue: 0
      });

      // Fetch upcoming deadlines
      const deadlinesRes = await axios.get('/students/me/deadlines');
      setUpcomingDeadlines(Array.isArray(deadlinesRes.data) ? deadlinesRes.data : []);

      // Fetch recent attendance
      const attendanceRes = await axios.get('/students/me/attendance/recent');
      setRecentAttendance(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set defaults on error
      setStats({
        cgpa: 0,
        enrolledCourses: 0,
        attendancePercentage: 0,
        assignmentsDue: 0
      });
      setUpcomingDeadlines([]);
      setRecentAttendance([]);
    } finally {
      setLoading(false);
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">Here's what's happening with your academics today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current CGPA"
          value={Number(stats?.cgpa || 0).toFixed(2)}
          icon={Award}
          color="blue"
          trend={Number(stats?.cgpa || 0) >= 8 ? 'up' : Number(stats?.cgpa || 0) >= 6 ? 'neutral' : 'down'}
        />
        <StatCard
          title="Enrolled Courses"
          value={stats?.enrolledCourses || 0}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Attendance"
          value={`${stats?.attendancePercentage || 0}%`}
          icon={TrendingUp}
          color={(stats?.attendancePercentage || 0) >= 75 ? 'green' : 'red'}
          trend={(stats?.attendancePercentage || 0) >= 75 ? 'up' : 'down'}
        />
        <StatCard
          title="Assignments Due"
          value={stats?.assignmentsDue || 0}
          icon={Clock}
          color={(stats?.assignmentsDue || 0) > 0 ? 'orange' : 'green'}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Deadlines</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{deadline.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{deadline.course_name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        deadline.days_left <= 1
                          ? 'bg-red-100 text-red-700'
                          : deadline.days_left <= 3
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {deadline.days_left === 0 ? 'Today' : `${deadline.days_left}d left`}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(deadline.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Attendance</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          {recentAttendance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No recent attendance records</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-600'
                        : record.status === 'absent'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {record.status === 'present' ? '✓' : record.status === 'absent' ? '✗' : 'L'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{record.course_name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(record.session_date).toLocaleDateString()} - {record.session_type}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === 'present'
                      ? 'bg-green-100 text-green-700'
                      : record.status === 'absent'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">View Schedule</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Submit Assignment</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Check Grades</span>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
