'use client';
import { useState } from 'react';
import pdfToText from 'react-pdftotext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DemoPDFPage() {
  const pathname = usePathname();
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mx-2 my-2">
        <svg
          width="176"
          height="36"
          viewBox="0 0 176 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.672 9.152L20.28 26H15.312L12.624 14.912L9.84 26H4.872L0.6 9.152H4.992L7.416 21.416L10.416 9.152H14.928L17.808 21.416L20.256 9.152H24.672ZM34.6982 26.168C33.1142 26.168 31.6582 25.8 30.3302 25.064C29.0182 24.328 27.9702 23.304 27.1862 21.992C26.4182 20.664 26.0342 19.176 26.0342 17.528C26.0342 15.88 26.4182 14.4 27.1862 13.088C27.9702 11.776 29.0182 10.752 30.3302 10.016C31.6582 9.28 33.1142 8.912 34.6982 8.912C36.2822 8.912 37.7302 9.28 39.0422 10.016C40.3702 10.752 41.4102 11.776 42.1622 13.088C42.9302 14.4 43.3142 15.88 43.3142 17.528C43.3142 19.176 42.9302 20.664 42.1622 21.992C41.3942 23.304 40.3542 24.328 39.0422 25.064C37.7302 25.8 36.2822 26.168 34.6982 26.168ZM34.6982 22.424C36.0422 22.424 37.1142 21.976 37.9142 21.08C38.7302 20.184 39.1382 19 39.1382 17.528C39.1382 16.04 38.7302 14.856 37.9142 13.976C37.1142 13.08 36.0422 12.632 34.6982 12.632C33.3382 12.632 32.2502 13.072 31.4342 13.952C30.6342 14.832 30.2342 16.024 30.2342 17.528C30.2342 19.016 30.6342 20.208 31.4342 21.104C32.2502 21.984 33.3382 22.424 34.6982 22.424ZM54.1894 26L50.6854 19.64H49.7014V26H45.5974V9.152H52.4854C53.8134 9.152 54.9414 9.384 55.8694 9.848C56.8134 10.312 57.5174 10.952 57.9814 11.768C58.4454 12.568 58.6774 13.464 58.6774 14.456C58.6774 15.576 58.3574 16.576 57.7174 17.456C57.0934 18.336 56.1654 18.96 54.9334 19.328L58.8214 26H54.1894ZM49.7014 16.736H52.2454C52.9974 16.736 53.5574 16.552 53.9254 16.184C54.3094 15.816 54.5014 15.296 54.5014 14.624C54.5014 13.984 54.3094 13.48 53.9254 13.112C53.5574 12.744 52.9974 12.56 52.2454 12.56H49.7014V16.736ZM71.0216 26L65.3576 18.56V26H61.2536V9.152H65.3576V16.544L70.9736 9.152H75.7976L69.2696 17.408L76.0376 26H71.0216Z"
            fill="black"
          />
          <path
            d="M102.312 9.44V26H100.632V12.776L94.728 26H93.504L87.6 12.824V26H85.92V9.44H87.696L94.104 23.792L100.512 9.44H102.312Z"
            fill="black"
          />
          <path
            d="M134.736 10.224V11.616H130.08V27H128.4V11.616H123.72V10.224H134.736ZM136.621 18.6C136.621 16.952 136.981 15.48 137.701 14.184C138.421 12.872 139.405 11.856 140.653 11.136C141.901 10.4 143.293 10.032 144.829 10.032C146.701 10.032 148.301 10.48 149.629 11.376C150.973 12.256 151.949 13.504 152.557 15.12H150.589C150.109 13.984 149.373 13.096 148.381 12.456C147.405 11.816 146.221 11.496 144.829 11.496C143.597 11.496 142.485 11.784 141.493 12.36C140.517 12.936 139.749 13.768 139.189 14.856C138.629 15.928 138.349 17.176 138.349 18.6C138.349 20.024 138.629 21.272 139.189 22.344C139.749 23.416 140.517 24.24 141.493 24.816C142.485 25.392 143.597 25.68 144.829 25.68C146.221 25.68 147.405 25.368 148.381 24.744C149.373 24.104 150.109 23.224 150.589 22.104H152.557C151.949 23.704 150.973 24.944 149.629 25.824C148.285 26.704 146.685 27.144 144.829 27.144C143.293 27.144 141.901 26.784 140.653 26.064C139.405 25.328 138.421 24.312 137.701 23.016C136.981 21.72 136.621 20.248 136.621 18.6ZM168.36 10.224V27H166.68V19.152H157.584V27H155.904V10.224H157.584V17.76H166.68V10.224H168.36Z"
            fill="black"
          />
          <path
            d="M109.574 23.1121V17.2343C109.976 13.249 116.978 11.5286 118.413 17.2343C118.643 18.9738 118.017 22.4698 113.678 22.5386C112.673 22.3666 112.645 20.2736 113.678 20.2736C116.645 20.2736 117.466 15.9728 113.994 15.7721C113.42 15.8008 112.342 15.9176 111.813 17.4064C111.813 18.2092 111.659 21.6307 111.813 22.9687C112.004 23.6377 112.811 24.9413 114.51 24.8037C116.634 24.6317 121.111 22.51 120.68 17.8078C120.25 13.1056 117.351 11.5286 113.994 11.2419C110.636 10.9552 106.991 14.6252 107.25 18.3239C106.991 19.0407 105.884 19.8148 105.011 18.3239C104.848 15.428 106.405 9.27153 113.994 9.00551C120.537 8.77613 123.435 15.7721 122.947 18.1232C122.947 20.9904 120.525 26.9369 114.51 26.9828C113.056 27.1166 110.033 26.5298 109.574 23.1121Z"
            fill="#EE4266"
          />
        </svg>

        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className={`${pathname === "/" ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#EE4266] relative" : ""}`}
          >
            Quiero Contratar
          </Link>
          <Link 
            href="/trabaja" 
            className={`${pathname === "/trabaja" ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#EE4266] relative" : ""}`}
          >
            Quiero Trabajar
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/ingresar" className="text-[#EE4266] font-bold">
            Ingresar
          </Link>
          <Link href="/crear-cuenta" className="bg-[#EE4266] text-white px-4 py-2 rounded-full font-bold">
            Crear Cuenta
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Extraer texto de un PDF</h1>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor="pdf-upload" className="w-full flex flex-col items-center px-8 py-6 bg-white text-gray-500 rounded-lg shadow-lg tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50">
                <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                </svg>
                <span className="mt-2 text-base">Selecciona un archivo PDF</span>
                <input id="pdf-upload" type="file" accept="application/pdf" onChange={extractText} className="hidden" />
              </label>
            </div>

            {isExtracting && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <svg className="animate-spin h-5 w-5 text-[#EE4266]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Extrayendo texto del PDF...</span>
              </div>
            )}

            {extractedText && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Texto extraído:</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="whitespace-pre-wrap text-gray-700">{extractedText}</p>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={analyzeText}
                    disabled={isAnalyzing}
                    className={`bg-[#EE4266] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d13a5c] transition-colors flex items-center gap-2 ${
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
                      'Analizar con IA'
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {categories.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Categorías identificadas:</h2>
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
        </div>
      </div>
    </div>
  );
}
