import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Phone, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminLayout: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex h-screen bg-gray-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
            Lencería Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/catalogs"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-rose-50 text-rose-600 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Catálogos</span>
          </NavLink>
          
          <NavLink
            to="/admin/contact"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-rose-50 text-rose-600 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Phone size={20} />
            <span>Contacto</span>
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => logout()}
            className="flex w-full items-center justify-center space-x-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm z-10">
          <h2 className="text-lg font-medium text-gray-800">Panel de Control</h2>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
