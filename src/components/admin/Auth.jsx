
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // para mostrar errores

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Por favor, completá email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      console.log("Enviando login con:", { email, password });

      const respuesta = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      const token = respuesta.data.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin");
      } else {
        setErrorMsg("No se recibió token de autenticación.");
      }
    } catch (error) {
      console.error("Error en login:", error);
      if (error.response?.status === 401) {
        setErrorMsg("Credenciales incorrectas. Revisá email y contraseña.");
      } else {
        setErrorMsg("Error en el servidor. Intentá más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">Iniciar sesión</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">
            {errorMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-2 top-2 text-gray-600 hover:text-pink-600 focus:outline-none"
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.04.193-2.04.55-2.955M3 3l18 18M9.879 9.879a3 3 0 014.242 4.242M15 15l3 3m-9-9l3 3"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-black py-2 rounded-full hover:bg-pink-600 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
