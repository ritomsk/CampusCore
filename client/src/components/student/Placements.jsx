import { useState, useEffect } from 'react';
import { Briefcase, Building, DollarSign, Calendar, MapPin, Filter, TrendingUp, Users } from 'lucide-react';
import axios from '../../api/axios';

const Placements = () => {
  const [loading, setLoading] = useState(true);
  const [placements, setPlacements] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    company: '',
    package_min: '',
    package_max: '',
    year: ''
  });

  useEffect(() => {
    fetchPlacements();
    fetchAnalytics();
  }, []);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/placements', {
        params: filters
      });
      setPlacements(response.data);
    } catch (error) {
      console.error('Error fetching placements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/placements/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    fetchPlacements();
  };

  const resetFilters = () => {
    setFilters({
      company: '',
      package_min: '',
      package_max: '',
      year: ''
    });
    setTimeout(() => fetchPlacements(), 0);
  };

  const formatPackage = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(2)} LPA`;
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
        <h1 className="text-3xl font-bold text-gray-800">Placement Records</h1>
        <p className="text-gray-600 mt-2">View successful placement records and statistics</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100">Total Placements</p>
              <Users className="w-6 h-6 text-blue-100" />
            </div>
            <p className="text-4xl font-bold">{analytics.total_placements}</p>
            <p className="text-sm text-blue-100 mt-2">Students Placed</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100">Highest Package</p>
              <TrendingUp className="w-6 h-6 text-green-100" />
            </div>
            <p className="text-3xl font-bold">{formatPackage(analytics.highest_package)}</p>
            <p className="text-sm text-green-100 mt-2">This Year</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100">Average Package</p>
              <DollarSign className="w-6 h-6 text-purple-100" />
            </div>
            <p className="text-3xl font-bold">{formatPackage(analytics.average_package)}</p>
            <p className="text-sm text-purple-100 mt-2">Across All</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100">Companies</p>
              <Building className="w-6 h-6 text-orange-100" />
            </div>
            <p className="text-4xl font-bold">{analytics.total_companies}</p>
            <p className="text-sm text-orange-100 mt-2">Recruiters</p>
          </div>
        </div>
      )}

      {/* Department-wise Stats */}
      {analytics?.department_stats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Department-wise Placement Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.department_stats.map((dept) => (
              <div key={dept.department} className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{dept.department}</p>
                <p className="text-2xl font-bold text-blue-600">{dept.count}</p>
                <p className="text-xs text-gray-500 mt-1">Avg: {formatPackage(dept.avg_package)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            placeholder="Company Name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            name="package_min"
            value={filters.package_min}
            onChange={handleFilterChange}
            placeholder="Min Package (LPA)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            name="package_max"
            value={filters.package_max}
            onChange={handleFilterChange}
            placeholder="Max Package (LPA)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="Year"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex space-x-2">
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Placements Table */}
      {placements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Placement Records Found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
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
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {placements.map((placement) => (
                  <tr key={placement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {placement.student_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{placement.student_name}</div>
                          <div className="text-xs text-gray-500">{placement.roll_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{placement.company_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{placement.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                        {placement.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-green-600">
                        {formatPackage(placement.package)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{placement.placement_year}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{placement.location || 'Not specified'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Recruiters */}
      {analytics?.top_recruiters && analytics.top_recruiters.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Recruiters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.top_recruiters.slice(0, 6).map((recruiter, index) => (
              <div
                key={recruiter.company_name}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 border-2 border-blue-200">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{recruiter.company_name}</h3>
                  <p className="text-sm text-gray-600">{recruiter.hire_count} students hired</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Placements;
