
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Credenciales demo
  const DEMO_EMAIL = "admin@demo.com";
  const DEMO_PASSWORD = "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">Iniciar sesión (demo)</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-full hover:bg-pink-600 transition duration-300"
        >
          Iniciar sesión
        </button>

        <p className="text-center text-gray-500 text-sm">
          Usuario demo: <strong>admin@demo.com</strong><br />
          Contraseña: <strong>admin123</strong>
        </p>
      </form>
    </div>
  );
};

export default Auth;
