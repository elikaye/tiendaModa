// Auth.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

// Mostrar a qué URL apunta el API
console.log("🚀 API_BASE_URL:", API_BASE_URL);

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Mostrar el origin desde el que se envía la petición
    console.log("🌐 Enviando login desde origin:", window.location.origin);

    if (!email || !password) {
      setErrorMsg("Por favor completá email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      // Llamada al backend con la URL de Railway
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        { email, password }
      );

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        if (user.rol === "admin") {
          localStorage.setItem("adminLoggedIn", "true");
          navigate("/admin");
        } else {
          localStorage.setItem("userLoggedIn", "true");
          navigate("/");
        }
      } else {
        setErrorMsg("No se recibieron datos válidos de autenticación.");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setErrorMsg("Credenciales incorrectas.");
            break;
          case 400:
            setErrorMsg("Datos inválidos. Verificá la información.");
            break;
          case 500:
            setErrorMsg("Error en el servidor. Intentá más tarde.");
            break;
          default:
            setErrorMsg("Error desconocido. Intentá nuevamente.");
        }
      } else if (error.request) {
        setErrorMsg(
          "No se recibió respuesta del servidor. Revisá que el backend esté levantado."
        );
      } else {
        setErrorMsg("Error al configurar la solicitud.");
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
        <h2 className="text-2xl font-bold text-center text-black">
          Iniciar sesión
        </h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">
            {errorMsg}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-2 top-2 text-pink-600 hover:text-pink-700 focus:outline-none"
              aria-label={
                mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {mostrarPassword ? <RiEyeOffLine size={24} /> : <RiEyeLine size={24} />}
            </button>
          </div>
        </div>

        <div className="text-right text-sm">
          <Link
            to="/forgot-password"
            className="text-purple-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition duration-300 flex items-center justify-center ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

        <div className="text-center mt-4 text-sm pt-2 border-t border-gray-200">
          ¿No tenés cuenta?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:underline font-semibold"
          >
            Registrate
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Auth;
