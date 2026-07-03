import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { CatalogModal } from '../components/catalogs/CatalogModal';
import toast, { Toaster } from 'react-hot-toast';

interface Catalog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  isActive: boolean;
  createdAt: string;
}

export const Catalogs: React.FC = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | undefined>();

  const fetchCatalogs = async () => {
    try {
      const response = await api.get('/catalogs');
      setCatalogs(response.data);
    } catch (error) {
      toast.error('Error al cargar los catálogos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este catálogo?')) {
      try {
        await api.delete(`/catalogs/${id}`);
        toast.success('Catálogo eliminado exitosamente');
        fetchCatalogs();
      } catch (error) {
        toast.error('Error al eliminar el catálogo');
      }
    }
  };

  const handleEdit = (catalog: Catalog) => {
    setEditingCatalog(catalog);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCatalog(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catálogos</h1>
          <p className="text-gray-500 mt-1">Gestiona los catálogos disponibles en la tienda</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Catálogo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      ) : catalogs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay catálogos</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer catálogo para mostrar a tus clientes.</p>
          <button
            onClick={handleCreate}
            className="text-rose-600 font-medium hover:text-rose-700"
          >
            Crear ahora &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img
                  src={catalog.imageUrl}
                  alt={catalog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!catalog.isActive && (
                  <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                    Inactivo
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{catalog.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {catalog.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <a
                    href={catalog.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 text-sm font-medium hover:text-rose-700 flex items-center"
                  >
                    Ver PDF <ExternalLink size={14} className="ml-1" />
                  </a>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(catalog)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(catalog.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CatalogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchCatalogs}
        catalog={editingCatalog}
      />
    </div>
  );
};
