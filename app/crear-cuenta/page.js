'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CrearCuentaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    terms: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const url = 'https://jossred.josprox.com/api/jossrednewuser';
      const requestData = {
        username: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        contra: formData.password
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();

      if (response.status === 422) {
        setError('Usuario ya registrado');
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Error al crear la cuenta');
        return;
      }

      // Verificar si la respuesta contiene un token
      if (!data.token) {
        setError('No se recibió un token válido');
        return;
      }

      // Guardar el token en cookies
      Cookies.set('token', data.token, { expires: 7 }); // Expira en 7 días
      
      // Redirigir a la página de home
      router.push('/home');
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.firstName.length}/100 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.lastName.length}/100 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.email.length}/100 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.phone.length}/100 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.password.length}/100 caracteres
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label className="text-sm">
                Acepto los términos y condiciones
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#EE4266] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#d13a5c] transition-colors"
            >
              Crear Cuenta
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/ingresar" className="text-[#EE4266] hover:underline font-bold">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 