import { useState, useEffect } from 'react';
import { Users, BookOpen, Briefcase, Building, TrendingUp, Award, Calendar, FileText } from 'lucide-react';
import StatCard from '../common/StatCard';
import axios from '../../api/axios';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfessors: 0,
    totalCourses: 0,
    totalPlacements: 0,
    activeBatches: 0,
    pendingEnrollments: 0
  });
  const [departmentStats, setDepartmentStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [placementTrends, setPlacementTrends] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin stats
      const statsRes = await axios.get('/admin/stats');
      setStats(statsRes.data);

      // Fetch department statistics
      const deptRes = await axios.get('/admin/departments');
      setDepartmentStats(deptRes.data);

      // Fetch recent activity
      const activityRes = await axios.get('/admin/activity');
      setRecentActivity(activityRes.data);

      // Fetch placement trends
      const placementRes = await axios.get('/placements/analytics');
      setPlacementTrends(placementRes.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">Complete system overview and management</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Professors"
          value={stats.totalProfessors}
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          color="green"
        />
        <StatCard
          title="Active Batches"
          value={stats.activeBatches}
          icon={Calendar}
          color="orange"
        />
        <StatCard
          title="Pending Enrollments"
          value={stats.pendingEnrollments}
          icon={FileText}
          color={stats.pendingEnrollments > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="Total Placements"
          value={stats.totalPlacements}
          icon={Briefcase}
          color="indigo"
        />
      </div>

      {/* Placement Highlights */}
      {placementTrends && (
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Placement Highlights</h2>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-green-100 text-sm">Highest Package</p>
                  <p className="text-3xl font-bold">
                    ₹{(placementTrends.highest_package / 100000).toFixed(2)} LPA
                  </p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Total Companies</p>
                  <p className="text-3xl font-bold">{placementTrends.total_companies}</p>
                </div>
              </div>
            </div>
            <TrendingUp className="w-16 h-16 text-green-100 opacity-50" />
          </div>
        </div>
      )}

      {/* Department Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2 text-blue-600" />
          Department Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentStats.map((dept, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{dept.department}</h3>
                <Building className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students</span>
                  <span className="font-bold text-blue-600">{dept.student_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Professors</span>
                  <span className="font-bold text-purple-600">{dept.professor_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Courses</span>
                  <span className="font-bold text-green-600">{dept.course_count}</span>
                </div>
                {dept.placement_count > 0 && (
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-600">Placements</span>
                    <span className="font-bold text-indigo-600">{dept.placement_count}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent System Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'student' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'professor' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'course' ? 'bg-green-100 text-green-600' :
                    activity.type === 'placement' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'student' ? <Users className="w-5 h-5" /> :
                     activity.type === 'professor' ? <Award className="w-5 h-5" /> :
                     activity.type === 'course' ? <BookOpen className="w-5 h-5" /> :
                     activity.type === 'placement' ? <Briefcase className="w-5 h-5" /> :
                     <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time_ago}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Student Enrollment Rate</span>
                <span className="text-lg font-bold text-blue-600">
                  {stats.totalStudents > 0 ? Math.round((stats.totalStudents / (stats.totalCourses * 50)) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.totalStudents > 0 ? Math.min(Math.round((stats.totalStudents / (stats.totalCourses * 50)) * 100), 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Professor-Student Ratio</span>
                <span className="text-lg font-bold text-purple-600">
                  1:{stats.totalProfessors > 0 ? Math.round(stats.totalStudents / stats.totalProfessors) : 0}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalStudents} students / {stats.totalProfessors} professors
              </p>
            </div>

            {stats.pendingEnrollments > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Action Required</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {stats.pendingEnrollments} enrollment requests pending review
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Manage Students</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Manage Professors</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Course Catalog</span>
          </button>
          <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Placements</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
