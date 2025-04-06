"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import pdfToText from "react-pdftotext";

export default function CrearCuentaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const extractText = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Por favor, selecciona un archivo PDF.");
      return;
    }

    setIsExtracting(true);
    setError("");

    pdfToText(file)
      .then((text) => {
        setExtractedText(text);
        setIsExtracting(false);
        analyzeText(text); // Automatically analyze the text after extraction
      })
      .catch((error) => {
        console.error("Error al extraer el texto:", error);
        alert("No se pudo extraer el texto del PDF.");
        setIsExtracting(false);
      });
  };

  const analyzeText = async (text) => {
    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al analizar el texto");
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
    setError("");

    try {
      // Construir la URL con los parámetros en la query string
      const url = `https://jossred.josprox.com/api/jossrednewuser?username=${encodeURIComponent(
        formData.firstName
      )}&first_name=${encodeURIComponent(
        formData.firstName
      )}&last_name=${encodeURIComponent(
        formData.lastName
      )}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(
        formData.phone
      )}&contra=${encodeURIComponent(formData.password)}`;

      console.log(url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 422) {
        setError("Usuario ya registrado");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Error al crear la cuenta");
        return;
      }

      if (!data.token) {
        setError("No se recibió un token válido");
        return;
      }

      Cookies.set("token", data.token, { expires: 7 });

      try {
        // Convert categories array to comma-separated string
        const categoriesString = categories.join(", ");

        // Make second API call
        const url2 = `https://bk.workmatch.ovh/api/usuarios?token_user=${
          data.token
        }&especialidades=${encodeURIComponent(
          categoriesString
        )}&curriculum=${encodeURIComponent(extractedText)}`;

        console.log(url2);
        const response2 = await fetch(url2, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response2.ok) {
          throw new Error("Error al registrar el perfil");
        }

        router.push("/home");
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        setError("Error al registrar el perfil");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
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
              <label className="block text-sm font-medium mb-1">
                Contraseña
              </label>
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

            <div className="flex flex-col items-center justify-center w-full">
              <label
                htmlFor="pdf-upload"
                className="w-full flex flex-col items-center px-8 py-6 bg-white text-gray-500 rounded-lg shadow-lg tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                </svg>
                <span className="mt-2 text-base">Sube tu CV en PDF</span>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={extractText}
                  className="hidden"
                />
              </label>
              {isExtracting && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
                  <svg
                    className="animate-spin h-5 w-5 text-[#EE4266]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Extrayendo texto del PDF...</span>
                </div>
              )}
              {isAnalyzing && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
                  <svg
                    className="animate-spin h-5 w-5 text-[#EE4266]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Analizando con Gemini...</span>
                </div>
              )}
              {categories.length > 0 && (
                <div className="mt-4 w-full">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Categorías identificadas:
                  </h3>
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

            <div className="flex items-center">
              <Link
                href="/crear-cuenta-empresa"
                className="text-sm text-[#EE4266] hover:underline font-bold"
              >
                ¿Eres una empresa?
              </Link>
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
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/ingresar"
              className="text-[#EE4266] hover:underline font-bold"
            >
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
