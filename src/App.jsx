import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function App() {
  const [topik, setTopik] = useState('')
  const [target, setTarget] = useState('Dosen Penguji')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // URL API CLOUD RUN KAMU
  const API_URL = "https://research-api-605141282095.us-central1.run.app/api/riset-lengkap"

  const handleRiset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topik, target_pembaca: target })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      alert("Gagal mengambil data: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // FUNGSI BARU: Memaksa link Google Widget buka di Tab Baru
  const processHtml = (html) => {
    if (!html) return '';
    // Cari semua tag <a href="..."> dan tambahkan target="_blank"
    return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  }

  return (
    // Tambah flex flex-col items-center biar wadahnya di tengah
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">🎓 Jurnal AI Assistant</h1>
          <p className="text-gray-500">Riset Jurnal & Karya Ilmiah Otomatis</p>
        </div>

        {/* FORM INPUT */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <form onSubmit={handleRiset} className="space-y-5">
            <div>
              <label className="block font-bold text-gray-700 mb-2">Topik Penelitian</label>
              <textarea 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                rows="3"
                placeholder="Contoh: Analisis Sentimen Pilkada 2024 metode Naive Bayes..."
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">Target Pembaca</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-xl bg-white"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option>Dosen Penguji</option>
                <option>Mahasiswa Umum</option>
                <option>Investor</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
            >
              {loading ? '⏳ Sedang Mencari Jurnal (±30s)...' : '🔍 Cari Bahan Jurnal'}
            </button>
          </form>
        </div>

        {/* HASIL OUTPUT */}
        {result && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">📄 Draft Jurnal</h2>
            
            {/* Teks Jurnal */}
            <div className="prose prose-blue max-w-none mb-10 text-justify leading-relaxed text-gray-700">
              <ReactMarkdown>{result.hasil_final}</ReactMarkdown>
            </div>

            {/* Widget Sumber Google */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                🔗 Referensi Ditemukan
                <span className="text-xs font-normal text-white bg-green-600 px-2 py-0.5 rounded-full">Verified</span>
              </h3>
              
              {result.sumber_html ? (
                <div 
                  className="google-source-widget text-sm"
                  // Panggil fungsi processHtml di sini biar link-nya _blank
                  dangerouslySetInnerHTML={{ __html: processHtml(result.sumber_html) }} 
                />
              ) : (
                <p className="text-sm text-gray-500 italic">AI menggunakan pengetahuan umum (General Knowledge) karena tidak menemukan jurnal spesifik yang pas.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App