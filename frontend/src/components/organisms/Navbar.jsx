// src/components/organisms/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Yakin ingin logout?')) {
      logout();
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Catatan Keuangan
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {/* Home - Always visible */}
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

            {/* Jika BELUM login */}
            {!isLoggedIn && (
              <>
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
                
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all"
                >
                  🔐 Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md"
                >
                  ✨ Sign Up
                </Link>
              </>
            )}

            {/* Jika SUDAH login */}
            {isLoggedIn && (
              <>
                {/* Dashboard User */}
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📊 Dashboard
                </Link>

                {/* Admin Panel - Hanya untuk Admin */}
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive('/admin') 
                        ? 'bg-red-100 text-red-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👑 Admin
                  </Link>
                )}

                <div className="w-px h-8 bg-gray-300 mx-2"></div>

                {/* User Info */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isAdmin() 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                      : 'bg-gradient-to-br from-green-400 to-emerald-500'
                  }`}>
                    <span className="text-white text-xs font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                    <p className="text-xs text-gray-500">{isAdmin() ? 'Admin' : 'User'}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-all border border-red-200"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;