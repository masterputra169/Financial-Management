// src/components/organisms/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Yakin ingin logout?')) {
      logout();
      alert('✅ Logout berhasil!');
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Catatan Keuangan
              </span>
              <p className="text-xs text-gray-500">Financial Management</p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <div className="flex items-center space-x-1">
            {/* Home Link */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏠 Home
            </Link>

            {/* Admin Dashboard - Only for logged in users */}
            {isLoggedIn && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive('/admin') 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                👑 Dashboard
              </Link>
            )}

            {/* Add Transaction - Always visible */}
            <Link
              to="/input"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/input') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ➕ Tambah
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/about') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ℹ️ Tentang
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300 mx-2"></div>

            {/* Auth Section */}
            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-all border border-red-200"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                🔐 Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;