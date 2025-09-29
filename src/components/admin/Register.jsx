
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nombre || !email || !password) {
      setErrorMsg("Por favor, completá todos los campos.");
      return;
    }

    setLoading(true);
    try {
      // Llamada al backend usando API_BASE_URL y sin withCredentials
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        nombre,
        email,
        password,
      });

      setSuccessMsg("Registro exitoso. Ahora podés iniciar sesión.");
      setNombre("");
      setEmail("");
      setPassword("");

      // Redirigir al login después de 2s
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
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
        <h2 className="text-2xl font-bold text-center text-black">Registrarse</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-2 text-center">
            {successMsg}
          </div>
        )}

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

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
            className="absolute right-2 top-2 text-pink-600 hover:text-pink-700 focus:outline-none"
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarPassword ? <RiEyeOffLine size={24} /> : <RiEyeLine size={24} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <div className="text-center mt-4 text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link to="/auth" className="text-purple-600 hover:underline font-semibold">
            Iniciá sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
