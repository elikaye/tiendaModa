// backend/controllers/favoritosController.js
import Favorito from '../models/favorito.js';

// 📦 Obtener todos los favoritos del usuario
export const getFavoritos = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: 'Usuario no autenticado' });

    const favorito = await Favorito.findOne({ where: { user_id: userId } });
    if (!favorito) return res.json({ productos: [] });

    const productos = Array.isArray(favorito.productos)
      ? favorito.productos
      : JSON.parse(favorito.productos || '[]');

    res.json({ productos });
  } catch (error) {
    console.error('❌ Error en getFavoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

// ❤️ Agregar un producto a favoritos (acumulando correctamente)
export const addFavorito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: 'Usuario no autenticado' });

    const { producto } = req.body;
    if (!producto || !producto.id)
      return res.status(400).json({ error: 'Producto válido requerido' });

    let favorito = await Favorito.findOne({ where: { user_id: userId } });

    if (!favorito) {
      // Si no existe, lo creamos con el primer producto
      favorito = await Favorito.create({
        user_id: userId,
        productos: [producto],
      });
    } else {
      // ✅ Aseguramos que productosActuales sea siempre un array real
      let productosActuales = Array.isArray(favorito.productos)
        ? favorito.productos
        : JSON.parse(favorito.productos || '[]');

      // Evitamos duplicados
      const existe = productosActuales.some((p) => p.id === producto.id);
      if (!existe) {
        productosActuales.push(producto);
        favorito.productos = productosActuales;
        await favorito.save();
      }
    }

    res.json({
      productos: Array.isArray(favorito.productos)
        ? favorito.productos
        : JSON.parse(favorito.productos || '[]'),
    });
  } catch (error) {
    console.error('❌ Error en addFavorito:', error);
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
};

// 💔 Eliminar un producto de favoritos
export const removeFavorito = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: 'Usuario no autenticado' });

    const { productoId } = req.body;
    if (!productoId)
      return res.status(400).json({ error: 'ProductoId requerido' });

    const favorito = await Favorito.findOne({ where: { user_id: userId } });
    if (!favorito)
      return res.status(404).json({ error: 'No hay favoritos para este usuario' });

    let productos = Array.isArray(favorito.productos)
      ? favorito.productos
      : JSON.parse(favorito.productos || '[]');

    productos = productos.filter((p) => p.id !== productoId);
    favorito.productos = productos;
    await favorito.save();

    res.json({ productos });
  } catch (error) {
    console.error('❌ Error en removeFavorito:', error);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
};

// 🗑️ Vaciar todos los favoritos
export const clearFavoritos = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: 'Usuario no autenticado' });

    const favorito = await Favorito.findOne({ where: { user_id: userId } });
    if (!favorito) return res.json({ productos: [] });

    favorito.productos = [];
    await favorito.save();

    res.json({ productos: [] });
  } catch (error) {
    console.error('❌ Error en clearFavoritos:', error);
    res.status(500).json({ error: 'Error al vaciar favoritos' });
  }
};
