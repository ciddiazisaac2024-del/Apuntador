import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Copy, Check, LogOut } from 'lucide-react';
import api from '../services/api';
import type { Case } from '../types';

export default function ExecutorDashboard() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/scripts/search?name=${encodeURIComponent(searchTerm)}`, {
          signal: controller.signal
        });
        setResults(response.data.cases);
      } catch (error: any) {
        if (error.name !== 'CanceledError' && error.message !== 'canceled') {
          console.error('Error fetching scripts:', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchTerm]);

  const handleCopy = async () => {
    if (selectedCase) {
      await navigator.clipboard.writeText(selectedCase.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Panel Ejecutivo</h1>
            <p className="text-sm text-slate-500">Bienvenido, {user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Search Section */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar caso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
              {loading ? (
                <div className="p-4 text-center text-slate-500">Buscando...</div>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {results.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => setSelectedCase(c)}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                          selectedCase?.id === c.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <p className="font-medium text-slate-800 truncate">{c.name}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {c.type}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : searchTerm ? (
                <div className="p-4 text-center text-slate-500">No se encontraron resultados</div>
              ) : (
                <div className="p-4 text-center text-slate-400 text-sm">Empieza a escribir para buscar un script</div>
              )}
            </div>
          </div>

          {/* Script Display Section */}
          <div className="md:col-span-2">
            {selectedCase ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{selectedCase.name}</h2>
                    <p className="text-sm text-slate-500">{selectedCase.type}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      copied 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Script
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6 bg-slate-50 flex-grow">
                  <textarea
                    readOnly
                    value={selectedCase.content}
                    className="w-full h-full min-h-[300px] p-4 bg-white border border-slate-200 rounded-lg text-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-slate-100/50 rounded-xl border border-dashed border-slate-300 p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Copy className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700">Ningún script seleccionado</h3>
                <p className="mt-2 text-slate-500 max-w-sm">
                  Busca un caso en el panel izquierdo y selecciónalo para ver y copiar su contenido.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
