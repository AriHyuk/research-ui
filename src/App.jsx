import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function App() {
  const [topik, setTopik] = useState('')
  const [target, setTarget] = useState('Dosen Penguji')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

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
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const processHtml = (html) => {
    if (!html) return '';
    return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-4xl"> {/* Lebarin dikit jadi max-w-4xl */}
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">🎓 Jurnal AI Assistant</h1>
          <p className="text-gray-500">Sekarang dengan Inline Citation Link!</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <form onSubmit={handleRiset} className="space-y-5">
            <div>
              <label className="block font-bold text-gray-700 mb-2">Topik Penelitian</label>
              <textarea 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                placeholder="Contoh: Implementasi Deep Learning untuk Deteksi Hama Padi..."
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">Target Pembaca</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-xl"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option>Dosen Penguji</option>
                <option>Mahasiswa Umum</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
            >
              {loading ? '⏳ Sedang Googling Link Jurnal...' : '🔍 Cari Bahan Jurnal'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">📄 Draft Jurnal (Interactive)</h2>
            
            <div className="prose prose-blue max-w-none mb-10 text-justify leading-relaxed text-gray-700">
              {/* INI BAGIAN SAKTINYA: Custom Renderer buat Link */}
              <ReactMarkdown 
                components={{
                  a: ({node, ...props}) => (
                    <a 
                      {...props} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:text-blue-800 hover:underline bg-blue-50 px-1 rounded border border-blue-200"
                      title="Klik untuk buka Jurnal Asli"
                    >
                      {props.children} 🔗
                    </a>
                  )
                }}
              >
                {result.hasil_final}
              </ReactMarkdown>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3">🔗 Semua Referensi (Google Widget)</h3>
              {result.sumber_html ? (
                <div 
                  className="google-source-widget text-sm"
                  dangerouslySetInnerHTML={{ __html: processHtml(result.sumber_html) }} 
                />
              ) : (
                <p className="text-sm text-gray-500">Tidak ada widget.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App