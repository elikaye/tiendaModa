import { useEffect, useState } from 'react';
import ProductForm from './ProductForm';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/products');
      const data = await res.json();
      setProductos(data.products || []);
    } catch (err) {
      console.error('❌ Error al obtener productos', err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return;

    try {
      await fetch(`http://localhost:5000/api/v1/products/${id}`, {
        method: 'DELETE',
      });
      fetchProductos(); // Recargar lista
    } catch (err) {
      console.error('❌ Error al eliminar producto', err);
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">Administrar Productos</h2>

      <button
        onClick={() => {
          setProductoEditando(null);
          setFormVisible(true);
        }}
        className="bg-pink-600 text-white px-4 py-2 rounded-lg mb-4"
      >
        ➕ Agregar Producto
      </button>

      {formVisible && (
        <ProductForm
          producto={productoEditando}
          onCancel={() => {
            setProductoEditando(null);
            setFormVisible(false);
          }}
          onSave={() => {
            setProductoEditando(null);
            setFormVisible(false);
            fetchProductos();
          }}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-pink-100">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-t">
                <td className="p-3">
                  <img
                    src={producto.imageUrl}
                    alt={producto.nombre}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">{producto.nombre}</td>
                <td className="p-3">${producto.precio}</td>
                <td className="p-3 capitalize">{producto.estado}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setProductoEditando(producto);
                      setFormVisible(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
