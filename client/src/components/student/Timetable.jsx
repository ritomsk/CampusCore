import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import axios from '../../api/axios';

const Timetable = () => {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState({});

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/timetable/student');
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalClasses = Object.values(timetable).reduce((sum, classes) => sum + classes.length, 0);

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
        <h1 className="text-3xl font-bold text-gray-800">My Weekly Timetable</h1>
        <p className="text-gray-600 mt-1">Your class schedule for the week</p>
      </div>

      {/* Timetable */}
      {totalClasses === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center">
          <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Scheduled</h3>
          <p className="text-gray-600 mb-4">
            You don't have any classes in your timetable yet.
          </p>
          <p className="text-sm text-gray-500">
            Enroll in courses to see your weekly schedule here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Day</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Classes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {daysOrder.map((day) => (
                  <tr key={day} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{day}</div>
                          <div className="text-xs text-gray-500">
                            {timetable[day]?.length || 0} {timetable[day]?.length === 1 ? 'class' : 'classes'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {timetable[day]?.length > 0 ? (
                        <div className="space-y-2">
                          {timetable[day].map((classItem, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center bg-blue-50 rounded-lg px-3 py-2 mr-2 mb-2"
                            >
                              <div className="text-sm">
                                <span className="font-semibold text-gray-900">
                                  {classItem.course_name}
                                </span>
                                {classItem.room_number && (
                                  <span className="text-gray-600 ml-2">
                                    • Room {classItem.room_number}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">No classes scheduled</div>
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

export default Timetable;
