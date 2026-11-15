import { useState, useEffect } from 'react';
import { Award, TrendingUp, BookOpen, Download } from 'lucide-react';
import axios from '../../api/axios';

const Grades = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/students/me/grades');
      setGrades(response.data.grades || []);
      setSummary(response.data.summary || {});
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
      setSummary({});
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-600';
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (grade) => {
    if (!grade) return 'bg-gray-100';
    if (grade === 'A+' || grade === 'A') return 'bg-green-100';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-100';
    if (grade === 'C+' || grade === 'C') return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const semesters = [...new Set(grades.map(g => g.semester))].sort();
  
  const filteredGrades = selectedSemester === 'all' 
    ? grades 
    : grades.filter(g => g.semester === parseInt(selectedSemester));

  const getScoreColor = (percentage) => {
    percentage = parseFloat(percentage);
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    percentage = parseFloat(percentage);
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 80) return 'bg-blue-100';
    if (percentage >= 70) return 'bg-yellow-100';
    if (percentage >= 60) return 'bg-orange-100';
    return 'bg-red-100';
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
        <h1 className="text-3xl font-bold text-gray-800">My Grades</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Download Transcript</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Current CGPA</p>
            <Award className="w-6 h-6 text-blue-100" />
          </div>
          <p className="text-4xl font-bold">{summary?.cgpa?.toFixed(2) || '0.00'}</p>
          <p className="text-sm text-blue-100 mt-2">Out of 10.0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Total Credits</p>
            <BookOpen className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{summary?.total_credits || 0}</p>
          <p className="text-sm text-gray-500 mt-2">Credits Earned</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Courses Completed</p>
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{summary?.courses_completed || 0}</p>
          <p className="text-sm text-gray-500 mt-2">Total Courses</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Average Score</p>
            <Award className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{summary?.average_score || '0'}%</p>
          <p className="text-sm text-gray-500 mt-2">Overall Performance</p>
        </div>
      </div>

      {/* Semester Performance - removed since we don't have semester GPA calculation */}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grades Table */}
      {filteredGrades.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Grades Available</h3>
          <p className="text-gray-600">Your grades will appear here once they are published.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CO Mapping
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{grade.course_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{grade.course_name}</div>
                      <div className="text-xs text-gray-500">{grade.professor_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{grade.assessment_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {grade.score} / {grade.max_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(grade.percentage)} ${getScoreColor(grade.percentage)}`}>
                        {grade.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900">{grade.semester}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{grade.co_mapping || '-'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Scale Reference */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Scale Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Excellent', range: '90-100%', color: 'green' },
            { label: 'Good', range: '80-89%', color: 'blue' },
            { label: 'Average', range: '70-79%', color: 'yellow' },
            { label: 'Below Avg', range: '60-69%', color: 'orange' },
            { label: 'Poor', range: '< 60%', color: 'red' }
          ].map((item) => {
            const bgColor = item.color === 'green' ? 'bg-green-100' : 
                           item.color === 'blue' ? 'bg-blue-100' :
                           item.color === 'yellow' ? 'bg-yellow-100' :
                           item.color === 'orange' ? 'bg-orange-100' : 'bg-red-100';
            const textColor = item.color === 'green' ? 'text-green-600' : 
                             item.color === 'blue' ? 'text-blue-600' :
                             item.color === 'yellow' ? 'text-yellow-600' :
                             item.color === 'orange' ? 'text-orange-600' : 'text-red-600';
            return (
              <div key={item.label} className={`p-4 rounded-lg ${bgColor}`}>
                <p className={`text-xl font-bold ${textColor}`}>{item.label}</p>
                <p className="text-sm text-gray-600 mt-1">{item.range}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Grades;
