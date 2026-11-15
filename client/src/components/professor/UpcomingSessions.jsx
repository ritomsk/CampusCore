import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const UpcomingSessions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/timetable/professor/upcoming');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSlotTypeColor = (type) => {
    switch (type) {
      case 'Lab':
        return 'bg-purple-100 text-purple-700';
      case 'Tutorial':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getSlotTypeIcon = (type) => {
    switch (type) {
      case 'Lab':
        return '🔬';
      case 'Tutorial':
        return '📝';
      default:
        return '📚';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Upcoming Sessions</h1>
        <p className="text-gray-600 mt-1">Your scheduled classes for the next 7 days</p>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center">
          <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Upcoming Classes</h3>
          <p className="text-gray-600 mb-4">
            You don't have any classes scheduled for the next week.
          </p>
          <p className="text-sm text-gray-500">
            Timetable schedules are managed by the admin for each batch.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((day) => (
            <div key={day.date} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl font-bold">{formatDate(day.date)}</h3>
                    <p className="text-sm text-blue-100">{day.day}, {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Sessions for this day */}
              <div className="divide-y divide-gray-200">
                {day.sessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/professor/batches/${session.batch_id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {/* Icon */}
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            {getSlotTypeIcon(session.slot_type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-lg font-bold text-gray-800">
                                  {session.course_name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {session.course_code} • Section {session.section}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSlotTypeColor(session.slot_type)}`}>
                                {session.slot_type}
                              </span>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              {session.room_number && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{session.room_number}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{session.enrolled_students} students</span>
                              </div>
                            </div>

                            {/* Batch name if available */}
                            {session.batch_name && (
                              <p className="text-xs text-gray-500 mt-2">
                                {session.batch_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {sessions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Quick Tip</p>
              <p>Click on any class to view the batch details, mark attendance, or manage course materials.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
