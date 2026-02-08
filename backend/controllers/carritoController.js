import Carrito from "../models/carrito.js";

// 🔹 Asegurar array siempre
const parseArray = (data) => {
  if (!data) return [];
  try {
    return Array.isArray(data) ? data : JSON.parse(data);
  } catch {
    return [];
  }
};

// 📦 Obtener carrito
export const getCarrito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuario no autenticado" });

    const carrito = await Carrito.findOne({ where: { user_id: userId } });
    if (!carrito) return res.json({ productos: [] });

    res.json({ productos: parseArray(carrito.productos) });
  } catch (error) {
    console.error("❌ Error en getCarrito:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
};

// 🛒 Agregar producto al carrito
export const addCarrito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuario no autenticado" });

    const { producto } = req.body;
    if (!producto || !producto.id)
      return res.status(400).json({ error: "Producto inválido" });

    const cantidad = Number(producto.cantidad || 1);

    const productoNormalizado = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imageUrl: producto.imageUrl,
      cantidad,
    };

    let carrito = await Carrito.findOne({ where: { user_id: userId } });

    if (!carrito) {
      carrito = await Carrito.create({
        user_id: userId,
        productos: JSON.stringify([productoNormalizado]),
      });
    } else {
      const productosActuales = parseArray(carrito.productos);

      const index = productosActuales.findIndex(
        (p) => p.id.toString() === productoNormalizado.id.toString()
      );

      if (index !== -1) {
        productosActuales[index].cantidad += cantidad;
      } else {
        productosActuales.push(productoNormalizado);
      }

      carrito.productos = JSON.stringify(productosActuales);
      await carrito.save();
    }

    res.json({ productos: parseArray(carrito.productos) });
  } catch (error) {
    console.error("❌ Error en addCarrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
};

// ❌ Eliminar producto del carrito
export const removeCarrito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuario no autenticado" });

    const { productoId } = req.body;
    if (!productoId)
      return res.status(400).json({ error: "productoId requerido" });

    const carrito = await Carrito.findOne({ where: { user_id: userId } });
    if (!carrito) return res.json({ productos: [] });

    const productosActuales = parseArray(carrito.productos).filter(
      (p) => p.id.toString() !== productoId.toString()
    );

    carrito.productos = JSON.stringify(productosActuales);
    await carrito.save();

    res.json({ productos: productosActuales });
  } catch (error) {
    console.error("❌ Error en removeCarrito:", error);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
};

// 🗑️ Vaciar carrito
export const clearCarrito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuario no autenticado" });

    const carrito = await Carrito.findOne({ where: { user_id: userId } });
    if (carrito) {
      carrito.productos = JSON.stringify([]);
      await carrito.save();
    }

    res.json({ productos: [] });
  } catch (error) {
    console.error("❌ Error en clearCarrito:", error);
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
};
