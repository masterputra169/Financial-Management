// src/pages/HomePage.jsx - Landing Page
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/organisms/Footer';

const HomePage = () => {
  const { isLoggedIn } = useAuth();

  const features = [
    { icon: '📝', title: 'Catat Transaksi', desc: 'Catat pemasukan dan pengeluaran dengan mudah dan cepat' },
    { icon: '📊', title: 'Dashboard Interaktif', desc: 'Lihat ringkasan keuangan Anda dalam tampilan visual yang menarik' },
    { icon: '📈', title: 'Analisis Kategori', desc: 'Analisis pengeluaran berdasarkan kategori untuk pengelolaan lebih baik' },
    { icon: '🔒', title: 'Aman & Privat', desc: 'Data keuangan Anda tersimpan dengan aman dan hanya bisa diakses oleh Anda' },
    { icon: '📱', title: 'Responsif', desc: 'Akses dari perangkat apapun - desktop, tablet, atau smartphone' },
    { icon: '⚡', title: 'Cepat & Ringan', desc: 'Aplikasi ringan dengan performa tinggi untuk pengalaman terbaik' },
  ];

  const steps = [
    { num: '1', title: 'Daftar Akun', desc: 'Buat akun gratis dalam hitungan detik' },
    { num: '2', title: 'Catat Transaksi', desc: 'Mulai catat pemasukan dan pengeluaran Anda' },
    { num: '3', title: 'Pantau Keuangan', desc: 'Lihat laporan dan analisis keuangan Anda' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Kelola Keuangan Pribadi
              <span className="block text-yellow-300">Dengan Mudah</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              Aplikasi pencatatan keuangan yang simpel, aman, dan membantu Anda 
              mengontrol pemasukan serta pengeluaran sehari-hari.
            </p>
            
            {!isLoggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  🚀 Mulai Gratis Sekarang
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-lg backdrop-blur-sm transition-all"
                >
                  🔐 Sudah Punya Akun? Login
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                📊 Buka Dashboard
              </Link>
            )}
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600">Semua yang Anda butuhkan untuk mengelola keuangan</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Cara Kerja</h2>
            <p className="text-xl text-gray-600">3 langkah mudah untuk mulai mengelola keuangan</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isLoggedIn && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Siap Mengontrol Keuangan Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Bergabung sekarang dan mulai perjalanan finansial yang lebih baik!
            </p>
            <Link
              to="/signup"
              className="inline-block px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              ✨ Daftar Gratis Sekarang
            </Link>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Dibangun Dengan</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['React', 'Tailwind CSS', 'Express.js', 'MySQL', 'JWT Auth'].map((tech, i) => (
              <span key={i} className="px-6 py-3 bg-white rounded-full shadow-md text-gray-700 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;