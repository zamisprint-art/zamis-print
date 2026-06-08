import React from 'react';

const FlatEngravedText2D = ({ text, font, color }) => {
  if (!text) return null;

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
      className={`relative select-none flex justify-center items-center ${
        font === 'Clásica' ? 'font-serif font-bold' : 
        font === 'Divertida' ? 'font-black' : 
        font === 'Cursiva' ? 'italic font-semibold' : 'font-black uppercase'
      }`}
      style={{
        // Rotación 3D para asentar el texto plano sobre la superficie
        transform: 'perspective(600px) rotateX(15deg) rotateZ(-2deg)',
        fontFamily: font === 'Divertida' ? '"Comic Sans MS", "Marker Felt", sans-serif' : 
                    font === 'Cursiva' ? '"Brush Script MT", "Lucida Handwriting", cursive' : undefined,
        height: '100px',
        width: '100%',
        color: styleParams.textColor,
        textShadow: styleParams.textShadow,
        letterSpacing: '0.05em'
      }}
    >
      <span className="text-3xl md:text-5xl">{text}</span>
    </div>
  );
};

export default FlatEngravedText2D;
