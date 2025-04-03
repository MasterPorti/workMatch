'use client';

import Link from 'next/link';
import { useState } from 'react';
import pdfToText from 'react-pdftotext';
import Header from '../components/Header';

export default function CrearCuentaPage() {
  const [extractedText, setExtractedText] = useState('');
  const [categories, setCategories] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const extractText = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Por favor, selecciona un archivo PDF.');
      return;
    }

    setIsExtracting(true);
    setError('');

    pdfToText(file)
      .then((text) => {
        setExtractedText(text);
        setCategories([]);
        setIsExtracting(false);
      })
      .catch((error) => {
        console.error('Error al extraer el texto:', error);
        alert('No se pudo extraer el texto del PDF.');
        setIsExtracting(false);
      });
  };

  const analyzeText = async () => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: extractedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar el texto');
      }

      setCategories(data.categories);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = {
      personalInfo: {
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        email: event.target.email.value,
      },
      security: {
        password: event.target.password.value,
        confirmPassword: event.target.confirmPassword.value,
      },
      cv: {
        text: extractedText,
        categories: categories,
      },
      terms: event.target.terms.checked,
      timestamp: new Date().toISOString()
    };

    const response = await fetch('http://localhost:3001/api/regreso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }); 
    const data = await response.json();
    console.log('Respuesta del servidor:', data);  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EE4266] focus:border-transparent"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EE4266] focus:border-transparent"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EE4266] focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EE4266] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EE4266] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {/* CV Upload Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Subir Currículum</h2>
              <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="cv-upload" className="w-full flex flex-col items-center px-8 py-6 bg-white text-gray-500 rounded-lg shadow-lg tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50">
                  <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                  </svg>
                  <span className="mt-2 text-base">Selecciona tu currículum en PDF</span>
                  <input id="cv-upload" type="file" accept="application/pdf" onChange={extractText} className="hidden" />
                </label>
              </div>

              {isExtracting && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mt-4">
                  <svg className="animate-spin h-5 w-5 text-[#EE4266]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Extrayendo texto del currículum...</span>
                </div>
              )}

              {extractedText && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={analyzeText}
                    disabled={isAnalyzing}
                    className={`w-full bg-[#EE4266] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d13a5c] transition-colors flex items-center justify-center gap-2 ${
                      isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analizando con Gemini 2.5 Pro...
                      </>
                    ) : (
                      'Analizar Currículum'
                    )}
                  </button>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  {categories.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Categorías identificadas:</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#EE4266] bg-opacity-10 text-white rounded-full text-sm font-medium border border-[#EE4266]"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="h-4 w-4 text-[#EE4266] focus:ring-[#EE4266] border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Acepto los{' '}
                <Link href="/terminos" className="text-[#EE4266] hover:underline">
                  términos y condiciones
                </Link>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#EE4266] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#d13a5c] transition-colors"
            >
              Crear cuenta
            </button>
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