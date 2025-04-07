"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { HiHome, HiUser, HiBriefcase, HiLogout, HiMail } from "react-icons/hi";

export default function HomeEmpresasPage() {
  const router = useRouter();
  const [empresaData, setEmpresaData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [vacantes, setVacantes] = useState([]);
  const [categorias, setCategorias] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchVacantes = async (empresaData) => {
    try {
      const response = await fetch(
        `https://bk.workmatch.ovh/api/vacantes?page=1&per_page=100`
      );
      const data = await response.json();
      setVacantes(data.vacantes);
    } catch (error) {
      console.error("Error al cargar las vacantes:", error);
    }
  };

  const analyzeDescription = async (descripcion) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: descripcion,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }

      const data = await response.json();
      // Extraer las categorías del texto de respuesta
      const categories = data.categories.join(", ");
      // Actualizar el campo de descripción con las categorías al final
      const descripcionConCategorias = `${descripcion}\n\nCategorías: ${categories}`;
      document.getElementById("descripcion").value = descripcionConCategorias;
      setCategorias(data.categories);
    } catch (error) {
      console.error("Error al analizar la descripción:", error);
      setCategorias([
        "Error al analizar la descripción. Por favor, intente nuevamente.",
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const descripcion = formData.get("descripcion");

    // Extraer las categorías de la descripción
    const categoriasMatch = descripcion.match(/Categorías: (.*)/);
    const categorias = categoriasMatch ? categoriasMatch[1].split(", ") : [];

    // Limpiar la descripción de las categorías
    const descripcionLimpia = descripcion
      .replace(/\n\nCategorías: .*/, "")
      .trim();

    // Si hay categorías, agregarlas al final de la descripción limpia
    const descripcionFinal =
      categorias.length > 0
        ? `${descripcionLimpia}\n\nCategorías: ${categorias.join(", ")}`
        : descripcionLimpia;

    const data = {
      correo: empresaData.correo,
      contra: empresaData.contra,
      titulo: formData.get("titulo"),
      descripcion: descripcionFinal,
      sueldo: formData.get("sueldo"),
      modalidad: formData.get("modalidad"),
    };

    try {
      const url = `https://bk.workmatch.ovh/api/vacantes?correo=${encodeURIComponent(
        data.correo
      )}&contra=${encodeURIComponent(data.contra)}&titulo=${encodeURIComponent(
        data.titulo
      )}&descripcion=${encodeURIComponent(
        data.descripcion
      )}&sueldo=${encodeURIComponent(
        data.sueldo
      )}&modalidad=${encodeURIComponent(data.modalidad)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setApiResponse(result);
      e.target.reset();
      await fetchVacantes(empresaData);
    } catch (error) {
      console.error("Error al crear la vacante:", error);
      setApiResponse({ error: "Error al crear la vacante" });
    }
  };

  const handleDeleteVacante = async (vacanteId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta vacante?")) {
      return;
    }

    try {
      const params = new URLSearchParams({
        correo: empresaData.correo,
        contra: empresaData.contra,
      });

      const response = await fetch(
        `https://bk.workmatch.ovh/api/vacantes/${vacanteId}?${params.toString()}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Actualizar el estado eliminando la vacante
        setVacantes(vacantes.filter((vacante) => vacante.id !== vacanteId));
      } else {
        const errorData = await response.json();
        setError(
          `Error al eliminar la vacante: ${
            errorData.message || "Error desconocido"
          }`
        );
      }
    } catch (error) {
      console.error("Error al eliminar la vacante:", error);
      setError("Error al eliminar la vacante");
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("empresaToken");
      const data = Cookies.get("empresaData");

      if (!token || !data) {
        router.push("/ingresar-empresas");
        return;
      }

      try {
        const empresaData = JSON.parse(data);
        setEmpresaData(empresaData);
        await fetchVacantes(empresaData);
      } catch (error) {
        setError("Error al cargar los datos de la empresa");
        router.push("/ingresar-empresas");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("empresaToken");
    Cookies.remove("empresaData");
    router.push("/ingresar-empresas");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-16 h-full flex flex-col items-center py-4 border-r border-gray-400/50">
          <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-8"
          >
            <path
              d="M7.36938 22.7361V13.2665C8.01668 6.84553 19.2982 4.07392 21.61 13.2665C21.9799 16.0689 20.9719 21.7014 13.9811 21.8123C12.3628 21.5351 12.3166 18.163 13.9811 18.163C18.7615 18.163 20.0842 11.2339 14.4897 10.9106C13.565 0.9106 11.8285 11.145 10.9758 13.5436C10.9758 14.837 10.7292 20.3495 10.9758 22.5052C11.284 23.583 12.5848 25.6833 15.3219 25.4615C18.7434 25.1844 25.9561 21.7661 25.2626 14.1903C24.5691 6.61457 19.8993 4.07391 14.4897 3.61198C9.0801 3.15004 3.20817 9.06283 3.62429 15.0218C3.20817 16.1766 1.42348 17.4239 0.017911 15.0218C-0.244099 10.3562 2.26387 0.437464 14.4897 0.00887692C25.0314 -0.360675 29.7012 10.9106 28.9152 14.6984C28.9152 19.3178 25.0129 28.8984 15.3219 28.9723C12.9793 29.1878 8.10913 28.2424 7.36938 22.7361Z"
              fill="#EE4266"
            />
          </svg>
          <div className="flex flex-col items-center gap-6">
            <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
              <HiHome className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
            </div>
            <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
              <HiUser className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
            </div>
            <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
              <HiBriefcase className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-[#fcfcfc] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EE4266]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-16 h-full flex flex-col items-center py-4 border-r border-gray-400/50">
        <svg
          width="29"
          height="29"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-8"
        >
          <path
            d="M7.36938 22.7361V13.2665C8.01668 6.84553 19.2982 4.07392 21.61 13.2665C21.9799 16.0689 20.9719 21.7014 13.9811 21.8123C12.3628 21.5351 12.3166 18.163 13.9811 18.163C18.7615 18.163 20.0842 11.2339 14.4897 10.9106C13.565 0.9106 11.8285 11.145 10.9758 13.5436C10.9758 14.837 10.7292 20.3495 10.9758 22.5052C11.284 23.583 12.5848 25.6833 15.3219 25.4615C18.7434 25.1844 25.9561 21.7661 25.2626 14.1903C24.5691 6.61457 19.8993 4.07391 14.4897 3.61198C9.0801 3.15004 3.20817 9.06283 3.62429 15.0218C3.20817 16.1766 1.42348 17.4239 0.017911 15.0218C-0.244099 10.3562 2.26387 0.437464 14.4897 0.00887692C25.0314 -0.360675 29.7012 10.9106 28.9152 14.6984C28.9152 19.3178 25.0129 28.8984 15.3219 28.9723C12.9793 29.1878 8.10913 28.2424 7.36938 22.7361Z"
            fill="#EE4266"
          />
        </svg>
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
            <HiHome className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
          </div>
          <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
            <HiUser className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
          </div>
          <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
            <HiBriefcase className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-[#fcfcfc]">
        <div className="w-full h-16 border-b flex justify-between items-center px-10 border-gray-400/50">
          <span className="text-2xl font-bold font-mono">Inicio</span>
          <div className="relative">
            <div
              className="w-10 h-10 bg-gradient-to-r from-[#EE4266] to-[#2339ff] rounded-full flex justify-center items-center cursor-pointer"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            ></div>
            {showMenu && (
              <div
                className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiMail className="text-[#EE4266]" />
                    <span className="text-sm truncate">
                      {empresaData?.correo || "No disponible"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <HiLogout className="text-[#EE4266]" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-10">
          <span className="text-2xl font-bold">
            ¡Hola, {empresaData?.nombre || "Empresa"}!
          </span>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Tus Vacantes Publicadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vacantes
                .filter((vacante) => {
                  const categoriasMatch =
                    vacante.descripcion.match(/Categorías: (.*)/);
                  return categoriasMatch && categoriasMatch[1].trim() !== "";
                })
                .map((vacante, index) => {
                  const categoriasMatch =
                    vacante.descripcion.match(/Categorías: (.*)/);
                  const categorias = categoriasMatch
                    ? categoriasMatch[1].split(", ").slice(0, 3)
                    : [];
                  const descripcionLimpia = categoriasMatch
                    ? vacante.descripcion
                        .replace(/\n\nCategorías: .*/, "")
                        .trim()
                    : vacante.descripcion;

                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-[#EE4266] mb-2">
                        {vacante.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 whitespace-pre-line overflow-y-auto h-32">
                        {descripcionLimpia}
                      </p>
                      {categorias.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {categorias.map((categoria, catIndex) => (
                            <span
                              key={catIndex}
                              className="px-2 py-1 text-xs font-medium bg-[#EE4266]/10 text-[#EE4266] rounded-full"
                            >
                              {categoria}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Sueldo: ${vacante.sueldo}</span>
                        <span>Modalidad: {vacante.modalidad}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Empresa: {vacante.empresa_nombre}</span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteVacante(vacante.id)}
                          className="px-3 py-1 text-sm text-white bg-[#EE4266] rounded-lg hover:bg-[#d13a5c] transition-colors duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Vacante</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título de la vacante
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#EE4266] focus:border-[#EE4266]"
                />
              </div>

              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  required
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#EE4266] focus:border-[#EE4266]"
                ></textarea>
                <button
                  type="button"
                  onClick={() => {
                    const descripcion =
                      document.getElementById("descripcion").value;
                    if (descripcion.length > 0) {
                      analyzeDescription(descripcion);
                    }
                  }}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#EE4266] hover:bg-[#d13a5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE4266]"
                >
                  {isAnalyzing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Analizando...
                    </>
                  ) : (
                    "Analizar Descripción"
                  )}
                </button>
                {categorias && !isAnalyzing && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Categorías sugeridas:
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {categorias.map((categoria, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-[#EE4266]/10 text-[#EE4266] rounded-full"
                        >
                          {categoria}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="sueldo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sueldo
                </label>
                <input
                  type="number"
                  id="sueldo"
                  name="sueldo"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#EE4266] focus:border-[#EE4266]"
                />
              </div>

              <div>
                <label
                  htmlFor="modalidad"
                  className="block text-sm font-medium text-gray-700"
                >
                  Modalidad
                </label>
                <select
                  id="modalidad"
                  name="modalidad"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#EE4266] focus:border-[#EE4266]"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="En linea">En línea</option>
                  <option value="Hibrido">Híbrido</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#EE4266] hover:bg-[#d13a5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE4266]"
                >
                  Crear Vacante
                </button>
              </div>
            </form>

            {apiResponse && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Respuesta de la API:
                </h3>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
