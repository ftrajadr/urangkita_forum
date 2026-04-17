import { Shield, Scale, Eye, UserX, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RulesContainer() {
  const navigate = useNavigate();

  const rules = [
    {
      title: "Ketentuan Pengguna (Terms of Use)",
      icon: Shield,
      content: [
        "Pengguna wajib berusia minimal 13 tahun.",
        "Dilarang menggunakan identitas orang/lembaga lain.",
        "Setiap postingan adalah tanggung jawab pribadi masing-masing penulis.",
        "Urangkita berhak menghapus konten yang dianggap melanggar hukum tanpa pemberitahuan."
      ]
    },
    {
      title: "Etika & Hukum (UU ITE)",
      icon: Scale,
      content: [
        "Dilarang menyebarkan berita bohong (Hoax) atau konten yang menyesatkan.",
        "Dilarang mengunggah konten yang mengandung SARA, penghinaan, atau pencemaran nama baik.",
        "Dilarang memicu kegaduhan, provokasi negatif, atau ujaran kebencian (hate speech).",
        "Dilarang mengunggah materi pornografi atau perjudian dalam bentuk apapun."
      ]
    },
    {
      title: "Privasi & Keamanan",
      icon: Eye,
      content: [
        "Kami tidak menjual data pribadi Sanak kepada pihak ketiga.",
        "Data email hanya digunakan untuk keperluan verifikasi dan keamanan akun.",
        "Dilarang melakukan 'Doxing' (menyebarkan data pribadi orang lain tanpa izin).",
        "Gunakan password yang kuat dan jangan bagikan akses akun kepada siapapun."
      ]
    },
    {
      title: "Larangan Keras (Banned)",
      icon: UserX,
      content: [
        "Spamming iklan atau link berbahaya (phishing).",
        "Melakukan hacking, scraping, atau merusak sistem Urangkita.",
        "Melanggar Hak Kekayaan Intelektual (Hak Cipta) milik orang lain.",
        "Pelecehan atau bullying terhadap sesama pengguna."
      ]
    }
  ];

  window.scrollTo({ top: 0, behavior: 'instant'});

  return (
    <main className="flex-1 pt-20 pb-20 px-4 max-w-2xl mx-auto w-full">
      <div className="mb-5 text-center">
        <h1 className="text-3xl font-black text-navy mb-2">Aturan Main.</h1>
        <p className="text-navy/50 font-bold text-xs uppercase tracking-[0.2em]">
          Demi kenyamanan dan keamanan Ranah & Rantau
        </p>
      </div>

      <div className="space-y-6">
        {rules.map((section, index) => (
          <section key={index} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-creme rounded-2xl text-terracotta">
                <section.icon size={22} />
              </div>
              <h2 className="text-lg font-extrabold text-navy">{section.title}</h2>
            </div>

            <ul className="space-y-3">
              {section.content.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-navy/70 leading-relaxed">
                  <span className="text-terracotta font-black">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4">
          <AlertCircle className="text-amber-600 shrink-0" size={24} />
          <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Pernyataan Hukum</h4>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              Dengan menggunakan layanan <strong>Urangkita</strong>, Sanak secara otomatis menyetujui seluruh aturan di atas. Pelanggaran terhadap aturan ini dapat berakibat pada penangguhan akun hingga pelaporan ke pihak berwajib jika ditemukan unsur pidana sesuai hukum Negara Kesatuan Republik Indonesia.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RulesContainer;