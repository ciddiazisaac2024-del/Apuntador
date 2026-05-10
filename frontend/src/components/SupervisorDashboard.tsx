import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, LogOut, X } from 'lucide-react';
import api from '../services/api';
import type { Case } from '../types';

export default function SupervisorDashboard() {
  const { user, logout } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<Partial<Case>>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const openNewModal = () => {
    setIsEditing(false);
    setCurrentCase({ name: '', type: '', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Case) => {
    setIsEditing(true);
    setCurrentCase(c);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este caso?')) {
      try {
        await api.delete(`/cases/${id}`);
        fetchCases();
      } catch (error) {
        console.error('Error deleting case', error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentCase.id) {
        await api.put(`/cases/${currentCase.id}`, currentCase);
      } else {
        await api.post('/cases', currentCase);
      }
      setIsModalOpen(false);
      fetchCases();
    } catch (error) {
      console.error('Error saving case', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Panel Supervisor</h1>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">Gestión de Casos</h2>
          <button
            onClick={openNewModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Caso
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nombre del Caso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Cargando casos...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No hay casos registrados. Crea uno nuevo.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{c.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">
                {isEditing ? 'Editar Caso' : 'Nuevo Caso'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col flex-grow overflow-hidden">
              <div className="px-6 py-4 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nombre del Caso</label>
                  <input
                    type="text"
                    required
                    value={currentCase.name || ''}
                    onChange={(e) => setCurrentCase({ ...currentCase, name: e.target.value })}
                    className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ej. Reclamo por garantía"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Tipo/Categoría</label>
                  <input
                    type="text"
                    required
                    value={currentCase.type || ''}
                    onChange={(e) => setCurrentCase({ ...currentCase, type: e.target.value })}
                    className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ej. Facturación"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <label className="block text-sm font-medium text-slate-700">Contenido del Script</label>
                  <textarea
                    required
                    value={currentCase.content || ''}
                    onChange={(e) => setCurrentCase({ ...currentCase, content: e.target.value })}
                    className="mt-1 w-full flex-grow min-h-[200px] px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="Escribe el script aquí..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 mt-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
