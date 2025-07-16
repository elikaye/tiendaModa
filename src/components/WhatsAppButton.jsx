import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=5491164283906&text=Hola%2C%20quiero%20hacer%20una%20consulta%20sobre%20un%20producto."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="flex items-center justify-center w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg hover:shadow-pink hover:bg-black transition-all duration-300 hover:scale-105">
        <FaWhatsapp size={28} className="text-white" />
      </div>
    </a>
  );
}
