import React from 'react';

const AnnouncementBar = () => {
  const block = "✨ ¡BIENVENIDO A ZAMIS PRINT! • TRANSFORMANDO LA IMAGINACIÓN EN REALIDAD 3D • CALIDAD PREMIUM EN CADA DETALLE ✨";

  return (
    <div className="bg-brand-900 text-brand-100 overflow-hidden flex items-center z-50 group border-b border-brand-800">
      <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] py-2">
        <div className="flex items-center justify-around w-max">
           <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] px-8 sm:px-12">{block}</span>
           <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] px-8 sm:px-12">{block}</span>
        </div>
        <div className="flex items-center justify-around w-max">
           <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] px-8 sm:px-12">{block}</span>
           <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] px-8 sm:px-12">{block}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
