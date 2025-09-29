import React from 'react';
import logo from '../assets/logo13.png';
import mercadopago from '../assets/mercado-pago.svg';
import facebook from '../assets/facebook-white.png';
import instagram from '../assets/instagram-white.png';
import whatsapp from '../assets/whatsapp-white.png';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6 font-body">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-start text-sm">

        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Logo tienda" className="h-28 mb-4" />
        </div>

        {/* Redes sociales */}
        <nav aria-label="Redes Sociales" className="flex flex-col items-center md:items-start gap-4">
          <p className="font-semibold text-gray-200 text-lg">Seguinos</p>
          <div className="flex gap-5">
            {[{
              href: "https://wa.me/+5491164283906",
              alt: "WhatsApp",
              src: whatsapp,
            }, {
              href: "https://www.instagram.com/barby_indu/",
              alt: "Instagram",
              src: instagram,
            }, {
              href: "https://www.facebook.com/barbara.andrada",
              alt: "Facebook",
              src: facebook,
            }].map(({ href, alt, src }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={alt}
                title={alt}
                className="hover:brightness-125 hover:text-pink-500 transition duration-300"
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-7 h-7 hover:scale-110 transition-transform duration-300"
                  style={{ filter: 'drop-shadow(0 0 5px #e733c9)' }}
                />
              </a>
            ))}
          </div>
        </nav>

        {/* Contacto */}
        <div className="text-center md:text-left space-y-2">
          <p className="font-semibold text-gray-200 text-lg">Contacto:</p>
          <p className="text-white">barby.indumentaria@email.com</p>
          <p className="font-semibold mt-4 text-gray-200 text-lg">WhatsApp:</p>
          <a
            href="https://wa.me/+5491164283906"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-pink-500 hover:underline transition duration-300"
          >
            +54 9 11 6428-3906
          </a>
        </div>

        {/* Formas de pago */}
        <div className="flex flex-col items-center md:items-start">
          <p className="font-semibold mb-3 text-gray-200 text-lg">Formas de pago:</p>
          <span className="text-white mb-2">Transferencia / Mercado Pago</span>
          <img src={mercadopago} alt="Mercado Pago" className="h-12 w-auto" />
        </div>
      </div>

      {/* Créditos con brillo y fuente destacada */}
      <div className="mt-12 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Barby Indumentaria. Todos los derechos reservados.</p>
        <p
          className="mt-4 text-xl font-extrabold tracking-widest font-title bg-gradient-to-r from-pink-600 via-pink-700 to-pink-900 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(247,37,133,0.8)] animate-shimmer"
          style={{
            backgroundImage: 'linear-gradient(135deg, #d1d5db 0%, #f9fafb 25%, #d1d5db 50%, #f9fafb 75%, #d1d5db 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s infinite',
          }}
        >
          Diseñado por &lt;/CodeMoon🌙&gt;
        </p>
      </div>
    </footer>
  );
}
