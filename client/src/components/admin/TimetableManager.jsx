import { useState, useEffect } from 'react';
import { Calendar, Save, X, Clock } from 'lucide-react';
import axios from '../../api/axios';

const TimetableManager = ({ courseCode, courseName, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDays, setSelectedDays] = useState({
    Monday: { enabled: false, room: '', type: 'Lecture' },
    Tuesday: { enabled: false, room: '', type: 'Lecture' },
    Wednesday: { enabled: false, room: '', type: 'Lecture' },
    Thursday: { enabled: false, room: '', type: 'Lecture' },
    Friday: { enabled: false, room: '', type: 'Lecture' },
    Saturday: { enabled: false, room: '', type: 'Lecture' },
    Sunday: { enabled: false, room: '', type: 'Lecture' }
  });

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (courseCode) {
      fetchTimetable();
    }
  }, [courseCode]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);

      // Fetch existing timetable
      const timetableResponse = await axios.get(`/timetable/course/${courseCode}`);
      
      // Populate selectedDays with existing data
      const newSelectedDays = { ...selectedDays };
      timetableResponse.data.forEach(slot => {
        newSelectedDays[slot.day_of_week] = {
          enabled: true,
          room: slot.room_number || '',
          type: slot.slot_type || 'Lecture'
        };
      });
      setSelectedDays(newSelectedDays);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      if (error.response?.status !== 404) {
        alert('Failed to load timetable');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day, enabled) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled
      }
    }));
  };

  const updateRoom = (day, room) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        room
      }
    }));
  };

  const updateType = (day, type) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        type
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Filter enabled days and format for API
      const days = daysOrder
        .filter(day => selectedDays[day].enabled)
        .map(day => ({
          day_of_week: day,
          room_number: selectedDays[day].room || null,
          slot_type: selectedDays[day].type
        }));

      await axios.post(`/timetable/course/${courseCode}/bulk`, { days });

      alert('Timetable updated successfully!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving timetable:', error);
      alert(error.response?.data?.message || 'Failed to save timetable');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Manage Weekly Schedule</h2>
              </div>
              <div className="text-blue-100 text-sm space-y-1">
                <p className="font-semibold text-lg">{courseCode} - {courseName}</p>
                <p className="text-sm">This schedule applies to all batches of this course</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Check the days when this course has classes. This schedule will apply to all batches of this course.
            </p>
          </div>

          {/* Days List */}
          <div className="space-y-3">
            {daysOrder.map(day => (
              <div
                key={day}
                className={`border rounded-xl p-4 transition-all ${
                  selectedDays[day].enabled
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDays[day].enabled}
                      onChange={(e) => toggleDay(day, e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-lg font-semibold text-gray-800 min-w-[120px]">
                      {day}
                    </span>
                  </label>

                  {/* Room and Type inputs (only if enabled) */}
                  {selectedDays[day].enabled && (
                    <div className="flex-1 flex space-x-3">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Room Number</label>
                        <input
                          type="text"
                          value={selectedDays[day].room}
                          onChange={(e) => updateRoom(day, e.target.value)}
                          placeholder="e.g., LH-101"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Type</label>
                        <select
                          value={selectedDays[day].type}
                          onChange={(e) => updateType(day, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Lecture">Lecture</option>
                          <option value="Lab">Lab</option>
                          <option value="Tutorial">Tutorial</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-700">
              <strong>Selected:</strong>{' '}
              {daysOrder.filter(day => selectedDays[day].enabled).length > 0
                ? daysOrder.filter(day => selectedDays[day].enabled).join(', ')
                : 'No days selected'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Total classes per week: {daysOrder.filter(day => selectedDays[day].enabled).length}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableManager;
