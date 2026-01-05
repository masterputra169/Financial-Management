import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Tentang Aplikasi" />
      
      <main className="container mx-auto px-6 py-8 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tentang Catatan Keuangan Pribadi</h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Aplikasi <strong>Catatan Keuangan Pribadi</strong> adalah solusi sederhana untuk membantu Anda 
              mengelola pemasukan dan pengeluaran sehari-hari.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Fitur Utama:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Mencatat transaksi pemasukan dan pengeluaran</li>
              <li>Kategorisasi transaksi untuk analisis yang lebih baik</li>
              <li>Dashboard ringkasan keuangan real-time</li>
              <li>Interface yang responsif dan mudah digunakan</li>
              <li>Navigasi dengan React Router DOM</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Teknologi yang Digunakan:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <p className="font-semibold text-blue-800">React</p>
              </div>
              <div className="bg-cyan-100 p-4 rounded-lg text-center">
                <p className="font-semibold text-cyan-800">Tailwind CSS</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <p className="font-semibold text-purple-800">Vite</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <p className="font-semibold text-green-800">React Router</p>
              </div>
            </div>

              <div className="bg-gray-100 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Informasi Developer
          </h3>
            <div className="bg-gray-100 p-6 rounded-lg mt-6">
              {/* Ganti 4 <p> tag Anda dengan grid ini */}
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                {/* Kolom 1 (Label) */}
                <strong>Nama</strong>
                {/* Kolom 2 (Value) */}
                <span>: Timotius Kusuma Wardana Putra</span>

                <strong>NIM</strong>
                <span>: F11.2025.00102</span>

                <strong>Mata Kuliah</strong>
                <span>: Pemrograman Sisi Klien</span>

                <strong>Tahun</strong>
                <span>: 2025</span>
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