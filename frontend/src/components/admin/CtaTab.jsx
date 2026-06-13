import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, Image, UploadCloud, AlertTriangle } from 'lucide-react';

const CtaTab = () => {
  const [form, setForm] = useState({
    badgeText: 'Servicio a Medida',
    title: '¿Lo imaginas?<br/>Nosotros lo imprimimos.',
    description: 'Desde piezas de ingeniería hasta regalos únicos pintados a mano.',
    buttonText: 'Cotizar mi diseño',
    buttonLink: '/contact',
    images: ['', '', '', '', '']
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState(null);

  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const checkImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ width: img.width, height: img.height });
      };
      img.src = objectUrl;
    });
  };

  const fetchCta = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/customcta');
      if (data) {
        setForm({
          badgeText: data.badgeText || '',
          title: data.title || '',
          description: data.description || '',
          buttonText: data.buttonText || '',
          buttonLink: data.buttonLink || '',
          images: data.images?.length === 5 ? data.images : ['', '', '', '', '']
        });
      }
    } catch (err) {
      setError('Error cargando configuración del CTA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCta(); }, []);

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingIdx(index);
    setError('');
    
    try {
      const dimensions = await checkImageDimensions(file);
      const isSquareSlot = index < 4;
      
      if (isSquareSlot && Math.abs(dimensions.width - dimensions.height) > 1) {
        throw new Error(`La Imagen ${index + 1} debe ser cuadrada (1:1). Ej: 800x800px. Tu imagen mide ${dimensions.width}x${dimensions.height}px.`);
      }
      
      if (!isSquareSlot) {
        // Tolerancia de 1 pixel por errores de redondeo en algunas exportaciones (ej 800x400)
        const expectedHeight = Math.round(dimensions.width / 2);
        if (Math.abs(dimensions.height - expectedHeight) > 1) {
          throw new Error(`La Imagen 5 debe ser horizontal (proporción 2:1). Ej: 800x400px o 1000x500px. Tu imagen es ${dimensions.width}x${dimensions.height}px.`);
        }
      }

      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const newImages = [...form.images];
      newImages[index] = data.filePath;
      setForm({ ...form, images: newImages });
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error subiendo imagen. Intenta con una URL.');
    } finally {
      setUploadingIdx(null);
      if (fileInputRefs[index].current) fileInputRefs[index].current.value = '';
    }
  };

  const handleImageChange = (val, index) => {
    const newImages = [...form.images];
    newImages[index] = val;
    setForm({ ...form, images: newImages });
  };

  const handleSave = async () => {
    if (form.images.some(img => !img.trim())) {
      setError('Por favor, ingresa las 5 imágenes para completar el collage.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.put('/api/customcta', form);
      setSuccess('Sección CTA guardada con éxito.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-neutral-500 py-8 text-center animate-pulse">Cargando datos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-brand-50 p-4 rounded-xl border border-brand-100">
        <div>
          <h3 className="text-lg font-bold text-brand-900">Sección CTA y Collage de 5 Imágenes</h3>
          <p className="text-brand-700 text-sm">Configura los textos y la galería visual para la sección de cotización personalizada.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-70"
        >
          {saving ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></span> : <Save size={18} />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm font-medium">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg border border-green-200 text-sm font-medium">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado izquierdo: Textos */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h4 className="font-bold text-neutral-800 border-b pb-2 mb-4">Textos Principales</h4>
            
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Etiqueta (Badge)</label>
              <input type="text" value={form.badgeText} onChange={e => setForm({...form, badgeText: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="Ej: Servicio a Medida" />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Título Principal (Soporta HTML como {'<br/>'})</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Descripción Breve</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all min-h-[100px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Texto del Botón</label>
                <input type="text" value={form.buttonText} onChange={e => setForm({...form, buttonText: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Enlace del Botón</label>
                <input type="text" value={form.buttonLink} onChange={e => setForm({...form, buttonLink: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho: Collage de Imágenes */}
        <div className="glass-panel p-6 rounded-2xl">
          <h4 className="font-bold text-neutral-800 border-b pb-2 mb-4 flex items-center justify-between">
            <span>Imágenes del Collage</span>
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">Requeridas: 5</span>
          </h4>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3 text-yellow-800 text-sm">
            <AlertTriangle className="shrink-0 mt-0.5" size={18} />
            <div>
              <strong>Guía de Collage:</strong>
              <ul className="list-disc pl-4 mt-1 opacity-80">
                <li><strong>Imagen 1 (Principal):</strong> Requiere ser Cuadrada (1:1). Sugerido: 800x800px.</li>
                <li><strong>Imágenes 2, 3 y 4:</strong> Requieren ser Cuadradas (1:1). Sugerido: 400x400px.</li>
                <li><strong>Imagen 5 (Inferior):</strong> Requiere ser Rectangular Horizontal (2:1). Sugerido: 800x400px.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className={`border rounded-xl p-4 flex gap-4 items-center ${index === 0 ? 'bg-brand-50/50 border-brand-200' : 'bg-white border-neutral-100'}`}>
                {form.images[index] ? (
                  <img src={form.images[index]} alt={`Img ${index+1}`} className="w-16 h-16 rounded-lg object-cover border border-neutral-200" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200 border-dashed">
                    <Image size={24} />
                  </div>
                )}
                
                <div className="flex-1">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Imagen {index + 1} {index === 0 ? '(Destacada Principal)' : ''} 
                    <span className="text-brand-600 ml-1 font-normal">
                      {index < 4 ? '(Req: Cuadrada 1:1)' : '(Req: Horizontal 2:1)'}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={form.images[index]} 
                      onChange={(e) => handleImageChange(e.target.value, index)}
                      placeholder="URL o sube un archivo 👉"
                      className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                    />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRefs[index]} 
                      onChange={(e) => handleFileUpload(e, index)}
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRefs[index].current.click()}
                      disabled={uploadingIdx === index}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                    >
                      {uploadingIdx === index ? 'Subiendo...' : <><UploadCloud size={16} /> Subir</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CtaTab;
