import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Search className="w-6 h-6" />
            <p className="text-xl">Page Not Found</p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Oops! This page doesn't exist
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for might have been moved, deleted, or never existed in the first place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Go to Home</span>
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="text-sm text-gray-600">
          <p className="mb-2">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Login
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/student')}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Student Dashboard
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/professor')}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Professor Dashboard
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
