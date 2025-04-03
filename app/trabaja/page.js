'use client'

import Link from 'next/link';
import Header from '../components/Header';

export default function TrabajaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Trabaja con nosotros</h1>
          <div className="space-y-4">
            <Link
              href="/ingresar"
              className="block w-full bg-[#EE4266] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#d13a5c] transition-colors text-center"
            >
              Ingresar
            </Link>
            <Link
              href="/crear-cuenta"
              className="block w-full bg-white text-[#EE4266] py-3 px-4 rounded-lg font-bold hover:bg-gray-50 transition-colors text-center border-2 border-[#EE4266]"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 