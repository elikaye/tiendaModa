import React, { useEffect, useState, useRef } from "react";
import ProductoCard from "../components/ProductoCard";
import { API_BASE_URL, CLOUDINARY_BASE_URL } from "../config";

let io = null;
try { io = require("socket.io-client"); } catch(e){ io = null; }

export default function RopaDeHombre(){
  const [productos,setProductos] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const socketRef = useRef(null);

  const fetchProductos = async()=>{
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE_URL}/products?categoria=ropa de hombre`);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const prods = (data.products || []).map(p => ({
        ...p,
        id: p.id || p._id,
        precio: parseFloat(p.precio) || 0,
        imageUrl: p.imageUrl && !p.imageUrl.startsWith("http") 
          ? `${CLOUDINARY_BASE_URL}${p.imageUrl}` 
          : p.imageUrl
      }));

      setProductos(prods);
      setError(null);
    }catch(err){
      console.error(err);
      setError("No se pudieron cargar los productos de ropa de hombre.");
      setProductos([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchProductos();
    let socketClient=null;
    try{
      if(io){
        socketClient=io.connect(window.location.origin);
        socketRef.current=socketClient;
        socketClient.on("productos:changed",fetchProductos);
      }
    }catch{}
    return ()=>{ if(socketRef.current) socketRef.current.disconnect(); };
  },[]);

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-pink-100 via-white to-pink-200">
      <div className="max-w-7xl mx-auto">

        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map(p => (
              <ProductoCard key={p.id} producto={p}/>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No hay productos disponibles en esta sección.
          </p>
        )}

      </div>
    </section>
  );
}
