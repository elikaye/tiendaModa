import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const ProductForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      imageUrl: imagen,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        nuevoProducto
      );
      console.log("Producto creado:", response.data);
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagen("");
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="number"
        step="0.01"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="URL de la imagen"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
      >
        Crear Producto
      </button>
    </form>
  );
};

export default ProductForm;
