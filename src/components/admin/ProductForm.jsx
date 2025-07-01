import { useState, useEffect } from 'react';

export default function ProductForm({ producto, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imageUrl: '',
    estado: 'activo',
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        imageUrl: producto.imageUrl || '',
        estado: producto.estado || 'activo',
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        imageUrl: '',
        estado: 'activo',
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = producto ? 'PUT' : 'POST';
    const url = producto
      ? `http://localhost:5000/api/v1/products/${producto.id}`
      : 'http://localhost:5000/api/v1/products';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error al guardar');

      onSave();
    } catch (err) {
      console.error('❌ Error al guardar producto:', err);
      alert('Ocurrió un error al guardar. Verificá los datos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Imagen (URL)</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/product/productoX.jpeg"
            className="w-full border px-3 py-2 rounded"
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Vista previa"
              className="mt-2 w-32 h-32 object-contain border rounded"
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {producto ? 'Actualizar' : 'Agregar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
