import mongoose from 'mongoose';

const customCtaSchema = new mongoose.Schema({
  badgeText: {
    type: String,
    default: 'Servicio a Medida'
  },
  title: {
    type: String,
    default: '¿Lo imaginas?<br/>Nosotros lo imprimimos.'
  },
  description: {
    type: String,
    default: 'Desde piezas de ingeniería hasta regalos únicos pintados a mano. Convierte tus ideas en plástico y resina de altísima calidad.'
  },
  buttonText: {
    type: String,
    default: 'Cotizar mi diseño'
  },
  buttonLink: {
    type: String,
    default: '/contact'
  },
  images: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

const CustomCta = mongoose.model('CustomCta', customCtaSchema);

export default CustomCta;
