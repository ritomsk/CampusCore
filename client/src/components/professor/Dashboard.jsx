import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, Clock, FileText, Award } from 'lucide-react';
import StatCard from '../common/StatCard';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [professorData, setProfessorData] = useState(null);
  const [stats, setStats] = useState({
    activeBatches: 0,
    totalStudents: 0,
    pendingEnrollments: 0,
    assignmentsToGrade: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch professor profile for name
      const profileRes = await axios.get('/professors/me');
      setProfessorData(profileRes.data);
      
      // Fetch professor stats
      const statsRes = await axios.get('/professors/me/stats');
      setStats(statsRes.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const professorName = professorData?.name || user?.name || 'Professor';
  const firstName = professorName.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(' ')[0];

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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Prof. {firstName}!</h1>
        <p className="text-purple-100">Here's your teaching overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Batches"
          value={stats.activeBatches}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Pending Enrollments"
          value={stats.pendingEnrollments}
          icon={Clock}
          color={stats.pendingEnrollments > 0 ? 'orange' : 'green'}
        />
        <StatCard
          title="To Grade"
          value={stats.assignmentsToGrade}
          icon={FileText}
          color={stats.assignmentsToGrade > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/professor/batches')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group"
          >
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Create Batch</span>
          </button>
          <button 
            onClick={() => navigate('/professor/enrollments')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group"
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Review Enrollments</span>
          </button>
          <button 
            onClick={() => navigate('/professor/attendance')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group"
          >
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Mark Attendance</span>
          </button>
          <button 
            onClick={() => navigate('/professor/assignments')}
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center group"
          >
            <Award className="w-8 h-8 mx-auto mb-2 text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Grade Assignments</span>
          </button>
        </div>
      </div>

      {/* Batch Overview */}
      {stats.batchOverview && stats.batchOverview.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Batches Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.batchOverview.map((batch) => (
              <div key={batch.batch_id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <h3 className="font-semibold text-gray-800">{batch.course_name}</h3>
                <p className="text-sm text-gray-600 mt-1">Batch {batch.batch_id}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{batch.student_count} students</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {batch.semester}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
