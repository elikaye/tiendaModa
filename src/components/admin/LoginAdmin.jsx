import { useState } from "react";

export default function LoginAdmin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usuario y contraseña hardcodeados (modificalos si querés)
    const usuarioValido = "admin";
    const passwordValido = "admin123";

    if (usuario === usuarioValido && password === passwordValido) {
      localStorage.setItem("adminLoggedIn", "true");
      window.location.href = "/admin"; // redirige al panel admin
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login Admin</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="border p-2 rounded"
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
