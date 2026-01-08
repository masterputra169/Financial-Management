import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, PieChart, Smartphone, Code, Zap, User, BookOpen, Calendar, GraduationCap, Server, Database } from 'lucide-react';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Pencatatan Transaksi",
      description: "Catat semua pemasukan dan pengeluaran dengan mudah"
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Kategorisasi Cerdas",
      description: "Analisis keuangan berdasarkan kategori transaksi"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Dashboard Real-time",
      description: "Pantau kesehatan finansial Anda secara langsung"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Responsive Design",
      description: "Akses dari perangkat apapun dengan nyaman"
    }
  ];

  const technologies = [
    { name: "React", color: "from-blue-400 to-blue-600", icon: <Code className="w-8 h-8" /> },
    { name: "Tailwind CSS", color: "from-cyan-400 to-cyan-600", icon: <Zap className="w-8 h-8" /> },
    { name: "Vite", color: "from-purple-400 to-purple-600", icon: <Zap className="w-8 h-8" /> },
    { name: "React Router", color: "from-green-400 to-green-600", icon: <Code className="w-8 h-8" /> },
    { name: "Express.js", color: "from-gray-600 to-gray-800", icon: <Server className="w-8 h-8" /> },
    { name: "MySQL", color: "from-orange-400 to-orange-600", icon: <Database className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header title="Tentang Aplikasi" />
      
      <main className="container mx-auto px-6 py-8 flex-grow">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <div className="flex items-center justify-center mb-4">
              <Wallet className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">
              Catatan Keuangan Pribadi
            </h1>
            <p className="text-lg md:text-xl text-center text-blue-100 max-w-2xl mx-auto">
              Solusi cerdas untuk mengelola pemasukan dan pengeluaran Anda dengan mudah dan efisien
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Teknologi yang Digunakan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`bg-gradient-to-br ${tech.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tech.icon}
                  </div>
                  <p className="font-semibold text-gray-800 text-center text-sm">
                    {tech.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Info Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
                <User className="w-6 h-6" />
                Informasi Developer
              </h2>
            </div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <User className="w-16 h-16" />
                  </div>
                </div>
                <div className="flex-grow w-full">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <User className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600 mb-1">Nama</p>
                        <p className="font-semibold text-gray-800">Timotius Kusuma Wardana Putra</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <GraduationCap className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600 mb-1">NIM</p>
                        <p className="font-semibold text-gray-800">F11.2025.00102</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600 mb-1">Mata Kuliah</p>
                        <p className="font-semibold text-gray-800">Pemrograman Sisi Klien</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600 mb-1">Tahun</p>
                        <p className="font-semibold text-gray-800">2025-2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;