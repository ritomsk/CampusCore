import { useState, useEffect } from 'react';
import { X, Copy, Check, Info } from 'lucide-react';
import axios from '../../api/axios';

const CreateBatchModal = ({ isOpen, onClose, onSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_code: '',
    batch_name: '',
    section: 'A',
    academic_year: new Date().getFullYear().toString(),
    semester: 'Autumn',
    enrollment_mode: 'request'
  });
  const [classCode, setClassCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate batch name when course is selected
    if (name === 'course_code') {
      const selectedCourse = courses.find(c => c.course_code === value);
      if (selectedCourse && !formData.batch_name) {
        setFormData(prev => ({
          ...prev,
          batch_name: `${selectedCourse.title} ${formData.semester} ${formData.academic_year}`
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/batches', formData);
      setClassCode(response.data.class_code);
      
      // Don't close modal immediately - show class code first
      if (onSuccess) {
        onSuccess(response.data.batch);
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      alert(error.response?.data?.message || 'Failed to create batch');
      setLoading(false);
    }
  };

  const copyClassCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setFormData({
      course_code: '',
      batch_name: '',
      section: 'A',
      academic_year: new Date().getFullYear().toString(),
      semester: 'Autumn',
      enrollment_mode: 'request'
    });
    setClassCode('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {classCode ? '✅ Batch Created!' : 'Create New Batch'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!classCode ? (
            // Creation Form
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a course...</option>
                  {courses.map((course) => (
                    <option key={course.course_code} value={course.course_code}>
                      {course.course_code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batch Name <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures Fall 2026"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from course if left empty
                </p>
              </div>

              {/* Section and Year Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="A"
                    maxLength="10"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleInputChange}
                    min="2020"
                    max="2030"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Autumn">Autumn</option>
                  <option value="Spring">Spring</option>
                </select>
              </div>

              {/* Enrollment Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enrollment Mode <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="enrollment_mode"
                      value="request"
                      checked={formData.enrollment_mode === 'request'}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Request (Recommended)</p>
                      <p className="text-sm text-gray-600">Students can request to join. You must approve each request.</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-all">
                    <input
                      type="radio"
                      name="enrollment_mode"
                      value="open"
                      checked={formData.enrollment_mode === 'open'}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Open</p>
                      <p className="text-sm text-gray-600">Students are automatically approved when they join with the class code.</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-500 transition-all">
                    <input
                      type="radio"
                      name="enrollment_mode"
                      value="invite_only"
                      checked={formData.enrollment_mode === 'invite_only'}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Invite Only</p>
                      <p className="text-sm text-gray-600">Only you can add students. Class code cannot be used to join.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Batch'}
                </button>
              </div>
            </form>
          ) : (
            // Success Screen with Class Code
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">Batch Created Successfully!</h3>
              <p className="text-gray-600 mb-8">Share this class code with your students to let them join</p>

              {/* Class Code Display */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-3">CLASS CODE</p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-5xl font-bold text-blue-600 tracking-wider font-mono">
                    {classCode}
                  </span>
                  <button
                    onClick={copyClassCode}
                    className="p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    title="Copy class code"
                  >
                    {copied ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <Copy className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 font-medium mt-3">✓ Copied to clipboard!</p>
                )}
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">How students can join:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Go to "My Courses" section</li>
                      <li>Click "Join with Class Code"</li>
                      <li>Enter this code: <span className="font-mono font-bold text-blue-600">{classCode}</span></li>
                      {formData.enrollment_mode === 'request' && (
                        <li className="text-orange-600">You'll need to approve their enrollment request</li>
                      )}
                      {formData.enrollment_mode === 'open' && (
                        <li className="text-green-600">They'll be automatically enrolled</li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBatchModal;
