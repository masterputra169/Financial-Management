// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const success = login(formData.username, formData.password);
    
    if (success) {
      alert('✅ Login berhasil! Selamat datang Admin.');
      navigate('/admin'); // ✅ Redirect ke halaman admin
    } else {
      setError('❌ Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Login Admin</h1>
          <p className="text-gray-600">Catatan Keuangan Pribadi</p>
        </div>

        {/* Login Form */}
        <div>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Masukkan username"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            required
          />

          <Button 
            variant="primary" 
            onClick={handleSubmit}
            type="button"
          >
            🔓 Login sebagai Admin
          </Button>

          {/* Info Kredensial */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Username: <code className="bg-blue-100 px-2 py-1 rounded">admin</code></p>
            <p className="text-xs text-blue-700">Password: <code className="bg-blue-100 px-2 py-1 rounded">admin123</code></p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              ← Kembali ke Home (Guest)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;