import React from 'react';

const CurvedEngravedText2D = ({ text, font, color }) => {
  if (!text) return null;

  const chars = text.split('');
  // Calcular el centro exacto para distribuir el arco
  const center = (chars.length - 1) / 2;
  
  // Parámetros ajustables de la curva
  // angleStep controla la separación (grados entre letras).
  // radius controla la curvatura (mayor radio = más plano).
  const angleStep = 10; 
  const radius = 400; 

  const getStyleForColor = () => {
    switch (color) {
      case 'Dorado':
        return {
          textColor: 'rgba(180, 83, 9, 0.4)', // Base oscura/transparente
          textShadow: '0px -1px 2px rgba(0,0,0,0.8), 0px 1px 1px rgba(254, 240, 138, 0.5), inset 0px 1px 2px rgba(0,0,0,1)'
        };
      case 'Negro':
        return {
          textColor: 'rgba(0, 0, 0, 0.6)',
          textShadow: '0px -1px 2px rgba(0,0,0,0.9), 0px 1px 1px rgba(255, 255, 255, 0.2)'
        };
      case 'Rojo':
        return {
          textColor: 'rgba(153, 27, 27, 0.4)',
          textShadow: '0px -1px 2px rgba(0,0,0,0.8), 0px 1px 1px rgba(252, 165, 165, 0.4)'
        };
      case 'Azul':
        return {
          textColor: 'rgba(30, 58, 138, 0.4)',
          textShadow: '0px -1px 2px rgba(0,0,0,0.8), 0px 1px 1px rgba(147, 197, 253, 0.4)'
        };
      case 'Verde':
        return {
          textColor: 'rgba(20, 83, 45, 0.4)',
          textShadow: '0px -1px 2px rgba(0,0,0,0.8), 0px 1px 1px rgba(134, 239, 172, 0.4)'
        };
      default:
        return {
          textColor: 'rgba(148, 163, 184, 0.4)',
          textShadow: '0px -1px 2px rgba(0,0,0,0.7), 0px 1px 1px rgba(255, 255, 255, 0.5)'
        };
    }
  };

  const styleParams = getStyleForColor();

  return (
    <div 
      className={`relative select-none flex justify-center items-start pt-10 ${
        font === 'Clásica' ? 'font-serif font-bold' : 
        font === 'Divertida' ? 'font-black' : 
        font === 'Cursiva' ? 'italic font-semibold' : 'font-black uppercase'
      }`}
      style={{
        // Rotación 3D para asentar el arco sobre la cara del plato
        transform: 'perspective(600px) rotateX(15deg) rotateZ(-2deg)',
        fontFamily: font === 'Divertida' ? '"Comic Sans MS", "Marker Felt", sans-serif' : 
                    font === 'Cursiva' ? '"Brush Script MT", "Lucida Handwriting", cursive' : undefined,
        height: '100px', // Reducimos el alto del contenedor principal
        width: '100%'
      }}
    >
      {chars.map((char, i) => {
        const angle = (i - center) * angleStep;
        return (
          <span
            key={i}
            className="absolute top-0 inline-block text-5xl md:text-7xl"
            style={{
              color: styleParams.textColor,
              textShadow: styleParams.textShadow,
              // Movemos el origen de rotación MUY abajo de la letra para crear un radio amplio ("sonrisa")
              transformOrigin: `50% ${radius}px`,
              // Rotamos la letra en ese eje (como es un punto abajo, negativo va a la izquierda)
              transform: `rotate(${angle}deg)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default CurvedEngravedText2D;
