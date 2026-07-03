import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  catalog?: any;
}

interface CatalogForm {
  title: string;
  description: string;
  isActive: boolean;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({ isOpen, onClose, onSaved, catalog }) => {
  const { register, handleSubmit, reset } = useForm<CatalogForm>();
  const [loading, setLoading] = useState(false);
  
  // States for files and urls
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (catalog) {
      reset({
        title: catalog.title,
        description: catalog.description,
        isActive: catalog.isActive,
      });
      setImageUrl(catalog.imageUrl || '');
      setPdfUrl(catalog.pdfUrl || '');
    } else {
      reset({ title: '', description: '', isActive: true });
      setImageUrl('');
      setPdfUrl('');
    }
    setImageFile(null);
    setPdfFile(null);
  }, [catalog, reset, isOpen]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/catalogs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
  };

  const onSubmit = async (data: CatalogForm) => {
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      let finalPdfUrl = pdfUrl;

      // Upload image if a new one was selected
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile);
      }
      
      // Upload PDF if a new one was selected
      if (pdfFile) {
        finalPdfUrl = await uploadFile(pdfFile);
      }

      if (!finalImageUrl || !finalPdfUrl) {
        toast.error('Debe proporcionar una imagen y un PDF.');
        setLoading(false);
        return;
      }

      const payload = {
        ...data,
        imageUrl: finalImageUrl,
        pdfUrl: finalPdfUrl,
      };

      if (catalog?.id) {
        await api.patch(`/catalogs/${catalog.id}`, payload);
        toast.success('Catálogo actualizado');
      } else {
        await api.post('/catalogs', payload);
        toast.success('Catálogo creado');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al guardar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {catalog ? 'Editar Catálogo' : 'Nuevo Catálogo'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              {...register('title', { required: true })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: Colección Verano 2024"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              {...register('description', { required: true })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Descripción del catálogo..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Imagen de Portada</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  {imageFile ? (
                    <span className="text-sm text-green-600 font-medium">{imageFile.name}</span>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Portada" className="h-24 w-auto object-cover rounded-lg mb-2" />
                  ) : (
                    <>
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <span className="text-sm text-gray-500">Haz clic para subir imagen</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Archivo PDF</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files && setPdfFile(e.target.files[0])}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center h-full">
                  {pdfFile ? (
                    <span className="text-sm text-green-600 font-medium">{pdfFile.name}</span>
                  ) : pdfUrl ? (
                    <span className="text-sm text-blue-600 font-medium truncate max-w-[200px]">PDF Actual subido</span>
                  ) : (
                    <>
                      <FileText className="text-gray-400 mb-2" size={32} />
                      <span className="text-sm text-gray-500">Haz clic para subir PDF</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-5 h-5 text-rose-500 border-gray-300 rounded focus:ring-rose-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Catálogo Activo (Visible al público)
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                'Guardando...'
              ) : (
                <>
                  <Upload size={18} className="mr-2" /> Guardar Catálogo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
