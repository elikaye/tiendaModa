import React from 'react';
import logo from '../assets/tienda-moda2.png';
import mercadopago from '../assets/mercado-pago.svg';
import facebook from '../assets/facebook-white.png';
import instagram from '../assets/instagram-white.png';
import whatsapp from '../assets/whatsapp-white.png';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center text-sm">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Logo tienda" className="h-20 mb-2" />
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <p className="font-semibold">Seguinos</p>
          <div className="flex gap-4">
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
                className="hover:brightness-125 hover:text-pink-400 transition duration-300"
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
        </div>

        {/* Contacto */}
        <div className="text-center md:text-left space-y-1">
          <p className="font-semibold">Contacto:</p>
          <a
            href="mailto:barbytienda@example.com"
            className="text-gray-300 hover:text-pink-400 hover:underline transition duration-300"
          >
            barbytienda@example.com
          </a>
          <p className="font-semibold mt-2">WhatsApp:</p>
          <a
            href="https://wa.me/+5491164283906"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-pink-400 hover:underline transition duration-300"
          >
            +54 9 11 6583-9090
          </a>
        </div>

        {/* Formas de pago */}
        <div className="flex flex-col items-center md:items-start">
          <p className="font-semibold mb-2">Formas de pago:</p>
          <span className="text-gray-300 mb-1">Transferencia / Mercado Pago</span>
          <img src={mercadopago} alt="Mercado Pago" className="h-10 w-auto" />
        </div>
      </div>

      {/* Créditos con brillo más intenso */}
      <div className="mt-10 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Barby Indumentaria. Todos los derechos reservados.</p>
        <p
          className="mt-3 text-lg font-extrabold tracking-widest bg-gradient-to-r from-zinc-100 via-white to-zinc-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,182,193,0.8)] animate-shimmer"
          style={{ filter: 'drop-shadow(0 0 15px #f72585)' }}
        >
          Diseñado por &lt;/CodeMoon🌙&gt;
        </p>
      </div>
    </footer>
  );
}
