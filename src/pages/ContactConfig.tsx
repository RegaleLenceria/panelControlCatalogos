import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Plus, Trash2, MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

interface Advisor {
  name: string;
  phone: string;
  message: string;
}

interface ContactForm {
  address: string;
  phone: string;
  schedule_weekdays: string;
  schedule_saturdays: string;
  schedule_sundays: string;
  advisors: Advisor[];
}

export const ContactConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { register, control, handleSubmit, reset } = useForm<ContactForm>({
    defaultValues: {
      advisors: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'advisors'
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await api.get('/contact-info');
        reset(response.data);
      } catch (error) {
        toast.error('Error al cargar la información de contacto');
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, [reset]);

  const onSubmit = async (data: ContactForm) => {
    setSaving(true);
    try {
      await api.patch('/contact-info', data);
      toast.success('Información actualizada correctamente');
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configuración de Contacto</h1>
          <p className="text-gray-500 mt-1">Administra la información pública y asesoras de venta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información General */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin size={20} className="mr-2 text-rose-500" /> Datos Principales
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Dirección Física</label>
                <input
                  {...register('address')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="Ej: Av. Principal #123, Ciudad"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Phone size={16} className="mr-1 text-gray-400" /> Teléfono General
                </label>
                <input
                  {...register('phone')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="Ej: +591 70000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock size={20} className="mr-2 text-rose-500" /> Horarios de Atención
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Lunes a Viernes</label>
              <input
                {...register('schedule_weekdays')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="09:00 - 18:00"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Sábados</label>
              <input
                {...register('schedule_saturdays')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="09:00 - 13:00"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Domingos</label>
              <input
                {...register('schedule_sundays')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="Cerrado"
              />
            </div>
          </div>
        </div>

        {/* Asesoras */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <MessageCircle size={20} className="mr-2 text-rose-500" /> Asesoras (WhatsApp)
            </h2>
            <button
              type="button"
              onClick={() => append({ name: '', phone: '', message: '' })}
              className="text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <Plus size={16} className="mr-1" /> Añadir Asesora
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {fields.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No hay asesoras registradas.</p>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col md:flex-row gap-4 relative group">
                  <div className="flex-1 space-y-1">
                    <label className="block text-xs font-medium text-gray-500">Nombre</label>
                    <input
                      {...register(`advisors.${index}.name` as const, { required: true })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="Ej: Carla"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="block text-xs font-medium text-gray-500">WhatsApp (Código país + Número)</label>
                    <input
                      {...register(`advisors.${index}.phone` as const, { 
                        required: true,
                        pattern: /^[0-9]+$/
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="Ej: 59175026806"
                    />
                  </div>
                  <div className="flex-[2] space-y-1">
                    <label className="block text-xs font-medium text-gray-500">Mensaje Predefinido</label>
                    <input
                      {...register(`advisors.${index}.message` as const)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="Hola Carla, me interesa comprar por mayor"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="md:self-end p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar asesora"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm flex items-center disabled:opacity-50"
          >
            {saving ? (
              'Guardando...'
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
