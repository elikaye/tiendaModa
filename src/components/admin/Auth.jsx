import { useState } from "react";

export default function Auth() {
  const [modo, setModo] = useState("login"); // 'login' o 'registro'

  // Estados para Login
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  // Estados para Registro
  const [nombreReg, setNombreReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [errorReg, setErrorReg] = useState("");
  const [mensajeReg, setMensajeReg] = useState("");

  // Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailLogin, password: passwordLogin }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorLogin(data.message || "Error en el login");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/admin"; // O donde quieras redirigir
    } catch {
      setErrorLogin("Error de conexión con el servidor");
    }
  };

  // Función para manejar el registro
  const handleRegistro = async (e) => {
    e.preventDefault();
    setErrorReg("");
    setMensajeReg("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreReg, email: emailReg, password: passwordReg }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorReg(data.message || "Error en el registro");
      } else {
        setMensajeReg("Registro exitoso, ya podés iniciar sesión");
        setNombreReg("");
        setEmailReg("");
        setPasswordReg("");
        setModo("login"); // Opcional: cambiar al modo login después de registrarse
      }
    } catch {
      setErrorReg("Error de conexión con el servidor");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {modo === "login" ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
              required
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
              required
              className="border p-2 rounded"
            />
            {errorLogin && <p className="text-red-600">{errorLogin}</p>}
            <button
              type="submit"
              className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              Ingresar
            </button>
          </form>
          <p className="mt-4 text-center">
            ¿No tenés cuenta?{" "}
            <button
              onClick={() => setModo("registro")}
              className="text-pink-600 font-semibold hover:underline"
            >
              Registrate aquí
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h2>
          <form onSubmit={handleRegistro} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={nombreReg}
              onChange={(e) => setNombreReg(e.target.value)}
              required
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={emailReg}
              onChange={(e) => setEmailReg(e.target.value)}
              required
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordReg}
              onChange={(e) => setPasswordReg(e.target.value)}
              required
              className="border p-2 rounded"
            />
            {errorReg && <p className="text-red-600">{errorReg}</p>}
            {mensajeReg && <p className="text-green-600">{mensajeReg}</p>}
            <button
              type="submit"
              className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              Registrarse
            </button>
          </form>
          <p className="mt-4 text-center">
            ¿Ya tenés cuenta?{" "}
            <button
              onClick={() => setModo("login")}
              className="text-pink-600 font-semibold hover:underline"
            >
              Iniciá sesión aquí
            </button>
          </p>
        </>
      )}
    </div>
  );
}
