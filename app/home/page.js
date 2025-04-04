'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/ingresar');
        return;
      }

      try {
        const response = await fetch(`https://jossred.josprox.com/api/jossredcheck?token=${token}`);
        const data = await response.json();

        if (!data.exists) {
          setError('Token no válido');
          Cookies.remove('token');
          router.push('/ingresar');
          return;
        }

        setUserData(data.user);
      } catch (error) {
        setError('Error al verificar el token');
      }
    };

    checkToken();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/ingresar');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Bienvenido</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {userData && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Username:</p>
                  <p className="font-medium">{userData.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email:</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full mt-6 bg-[#EE4266] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#d13a5c] transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
} 