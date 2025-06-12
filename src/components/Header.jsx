import lupa from '/icons/lupa.png';
import carrito from '/icons/carrito-de-compras.png';
import whatsapp from '/icons/whatsapp-black.png';
import facebook from '../assets/facebook-black.png';
import instagram from '../assets/instagram-black.png';

export default function Header() {
  return (
    <header className="bg-pink-300 p-4 flex items-center justify-between flex-wrap text-sm md:text-base shadow-md">
      
      {/* Logo a la izquierda */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <img src="corazon (4).png" alt="Logo Barbie Tienda" className="h-10" />
      </div>

      {/* Nombre y slogan centrados */}
      <div className="flex flex-col items-center flex-grow">
        <span className="text-lg font-extrabold text-black drop-shadow">Barby Tienda</span>
        <span className="hidden md:inline text-gray-800 text-xs">¡Todo lo que amás en un solo lugar!</span>
      </div>

      {/* Íconos a la derecha */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <img src={lupa} alt="Buscar" className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
        <img src={carrito} alt="Carrito" className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
        <a href="https://wa.me/+5491164283906" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <img src={whatsapp} alt="WhatsApp" className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
        </a>
        <a href="https://www.instagram.com/barby_indu/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <img src={instagram} alt="Instagram" className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
        </a>
        <a href="https://www.facebook.com/barbara.andrada" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
         <img src={facebook} alt="Facebook" className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
       </a>
      </div>
    </header>
  );
}
