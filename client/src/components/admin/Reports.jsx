import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('');

  const reports = [
    {
      id: 'student-enrollment',
      title: 'Student Enrollment Report',
      description: 'Comprehensive enrollment statistics and trends',
      icon: 'Users',
      color: 'blue'
    },
    {
      id: 'placement-statistics',
      title: 'Placement Statistics Report',
      description: 'Detailed placement data and analytics',
      icon: 'Briefcase',
      color: 'green'
    },
    {
      id: 'academic-performance',
      title: 'Academic Performance Report',
      description: 'Student grades and CGPA analysis',
      icon: 'Award',
      color: 'purple'
    },
    {
      id: 'attendance-summary',
      title: 'Attendance Summary Report',
      description: 'Department-wise attendance metrics',
      icon: 'CheckCircle',
      color: 'orange'
    },
    {
      id: 'course-popularity',
      title: 'Course Enrollment Analysis',
      description: 'Popular courses and enrollment patterns',
      icon: 'BookOpen',
      color: 'indigo'
    },
    {
      id: 'faculty-workload',
      title: 'Faculty Workload Report',
      description: 'Professor assignments and batch distribution',
      icon: 'Users',
      color: 'pink'
    }
  ];

  const handleGenerateReport = (reportId) => {
    setSelectedReport(reportId);
    alert(`Generating ${reports.find(r => r.id === reportId)?.title}...`);
    // In a real app, this would trigger actual report generation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">System Reports</h1>
        <p className="text-gray-600 mt-1">Generate comprehensive institutional reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Reports</p>
              <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Generated Today</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm font-semibold text-gray-800">Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Accuracy</p>
              <p className="text-2xl font-bold text-gray-800">98%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4`}>
              <FileText className={`w-6 h-6 text-${report.color}-600`} />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>

            <button
              onClick={() => handleGenerateReport(report.id)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Export Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-sm font-medium text-gray-700">Export as PDF</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-sm font-medium text-gray-700">Export as Excel</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-sm font-medium text-gray-700">Export as CSV</p>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Report Generation</h3>
            <p className="text-sm text-blue-800">
              Reports are generated in real-time using the latest data from the system. 
              All reports can be exported in multiple formats for further analysis and presentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
