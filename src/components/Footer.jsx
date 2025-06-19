import React from 'react';
import logo from '../assets/logo1.png';
import whatsapp from '../assets/whatsapp (2).png';
import instagram from '../assets/instagram-black.png';
import facebook from '../assets/facebook-black.png';
import mercadopago from '../assets/mercado-pago.svg';

const Footer = () => {
  return (
    <footer className="bg-black py-10 px-5"> {/* Agregado <footer> */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={logo} alt="Logo tienda" className="h-20 w-auto" />
        </div>

        {/* Redes sociales */}
        <div className="flex space-x-5">
          <a href="https://wa.me/+5491164283906" target="_pink" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:opacity-70 transition-opacity">
            <img src={whatsapp} alt="WhatsApp" className="h-10 w-10" />
          </a>
          <a href="https://www.instagram.com/barby_indu/" target="_pink" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-70 transition-opacity">
            <img src={instagram} alt="Instagram" className="h-10 w-10" />
          </a>
          <a href="https://www.facebook.com/barbara.andrada" target="_pink" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-70 transition-opacity">
            <img src={facebook} alt="Facebook" className="h-10 w-10" />
          </a>
        </div>

        {/* Contacto */}
        <div className="text-center md:text-left space-y-1 text-sm">
          <p className="text-white font-semibold ">
            Contacto: <a href="mailto:barbytienda@example.com" className="text-white hover:text-pink-400 hover:underline">barbytienda@example.com</a>
          </p>
          <p className="text-pink font-semibold">
            WhatsApp: <a href="https://wa.me/+5491164283906" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-400 hover:underline">+54 9 11 6583-9090</a>
          </p>
        </div>

        {/* Pasarela de pago */}
        <div className="flex-shrink-0">
        <p>Forma de Pago
          <span> Transferencias</span></p>
          <img src={mercadopago} alt="Mercado Pago" className="h-12 w-auto" />
        </div>
      </div>

      {/* Derechos y créditos */}
      <div className="mt-8 text-center text-xs text-white space-y-1">
        <p>© {new Date().getFullYear()} Barby Indumentaria. Todos los derechos reservados.</p>
        <p>
  Diseñado por{" "}
  <span className="font-semibold bg-gradient-to-r from-zinc-200 via-white to-zinc-300 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
  &lt;/CodeMoon🌙&gt;
</span>
</p>
      </div>
    </footer>
  );
};

export default Footer;
