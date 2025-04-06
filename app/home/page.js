"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userData2, setUserData2] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/ingresar");
        return;
      }

      try {
        const response = await fetch(
          `https://jossred.josprox.com/api/jossredcheck?token=${token}`
        );
        const data = await response.json();

        const response2 = await fetch(
          `https://bk.workmatch.ovh/api/usuarios/${token}`
        );
        const data2 = await response2.json();

        if (!data2 || !data2.token_user) {
          setError("Token no válido bk");
          console.log("Token no válido bk");
          console.log(data2);
          setTimeout(() => {
            Cookies.remove("token");
            router.push("/ingresar");
          }, 1000);
          return;
        }

        if (data.message === "Usuario no encontrado") {
          setError("Token no válido jossred");
          console.log("Token no válido jossred");
          console.log(data);
          setTimeout(() => {
            Cookies.remove("token");
            router.push("/ingresar");
          }, 1000);
          return;
        }

        if (!data.exists) {
          setError("Token no válido");
          Cookies.remove("token");
          router.push("/ingresar");
          return;
        }

        setUserData(data.user);
        setUserData2(data2);
      } catch (error) {
        setError("Error al verificar el token");
      }
    };

    checkToken();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/ingresar");
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

          {(userData || userData2) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Información del Usuario
              </h2>
              <div className="space-y-3">
                {userData && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Username:</p>
                      <p className="font-medium">{userData.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </>
                )}
                {userData2 && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">especialidades:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {userData2.especialidades
                          .split(", ")
                          .map((especialidad, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {especialidad}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">curriculum:</p>
                      <p className="font-medium whitespace-pre-line">
                        {userData2.curriculum}
                      </p>
                    </div>
                  </>
                )}
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
