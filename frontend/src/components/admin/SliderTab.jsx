import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, Save, X, Image, ExternalLink, UploadCloud, Link2 } from 'lucide-react';

const EMPTY_FORM = { title: '', subtitle: '', description: '', image: '', ctaText: 'Ver más', ctaLink: '/shop', isActive: true, order: 0 };

const SliderTab = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(f => ({ ...f, image: data.filePath }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error subiendo imagen. Intenta con una URL.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/slides/admin');
      setSlides(data);
    } catch (err) {
      setError('Error cargando slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const openCreate = () => {
    setEditingSlide(null);
    setForm({ ...EMPTY_FORM, order: slides.length });
    setShowForm(true);
    setError('');
    setImageMode('url');
  };

  const openEdit = (slide) => {
    setEditingSlide(slide);
    setForm({ ...slide });
    setShowForm(true);
    setError('');
    setImageMode('url');
  };

  const closeForm = () => { setShowForm(false); setEditingSlide(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.title || !form.image) { setError('El título y la imagen son obligatorios.'); return; }
    setSaving(true);
    setError('');
    try {
      if (editingSlide) {
        await axios.put(`/api/slides/${editingSlide._id}`, form);
      } else {
        await axios.post('/api/slides', form);
      }
      await fetchSlides();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error guardando slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este slide?')) return;
    try {
      await axios.delete(`/api/slides/${id}`);
      setSlides(prev => prev.filter(s => s._id !== id));
    } catch {
      alert('Error eliminando slide');
    }
  };

  const toggleActive = async (slide) => {
    try {
      await axios.put(`/api/slides/${slide._id}`, { ...slide, isActive: !slide.isActive });
      setSlides(prev => prev.map(s => s._id === slide._id ? { ...s, isActive: !s.isActive } : s));
    } catch {
      alert('Error actualizando slide');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900">Gestión del Slider</h2>
          <p className="text-sm text-neutral-500 mt-1">{slides.length} diapositivas en total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-colors shadow-md shadow-brand-500/30"
        >
          <Plus size={18} /> Nuevo Slide
        </button>
      </div>

      {/* Slide Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-neutral-500">Cargando slides...</div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 border-2 border-dashed border-neutral-200 rounded-2xl">
          <Image size={40} className="text-neutral-300" />
          <div>
            <p className="font-bold text-neutral-600">No hay slides aún</p>
            <p className="text-sm text-neutral-400 mt-1">Crea el primer slide para el Hero de la tienda</p>
          </div>
          <button onClick={openCreate} className="px-5 py-2 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors">
            Crear primer slide
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div
              key={slide._id}
              className={`flex gap-4 items-center p-4 rounded-2xl border ${slide.isActive ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50 opacity-60'} shadow-sm hover:shadow-md transition-all`}
            >
              {/* Order indicator */}
              <div className="flex flex-col items-center gap-1 text-neutral-400 shrink-0">
                <GripVertical size={16} />
                <span className="text-xs font-bold text-neutral-500">#{idx + 1}</span>
              </div>

              {/* Thumbnail */}
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/200x100?text=Sin+imagen'; }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-neutral-900 truncate">{slide.title}</h3>
                {slide.subtitle && <p className="text-xs text-brand-500 font-semibold mt-0.5 truncate">{slide.subtitle}</p>}
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <ExternalLink size={11} /> {slide.ctaLink}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-500'}`}>
                    {slide.isActive ? 'Activo' : 'Oculto'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(slide)}
                  className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-brand-600 transition-colors"
                  title={slide.isActive ? 'Ocultar' : 'Activar'}
                >
                  {slide.isActive ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
                <button
                  onClick={() => openEdit(slide)}
                  className="p-2 rounded-lg hover:bg-brand-50 text-neutral-500 hover:text-brand-600 transition-colors"
                  title="Editar"
                >
                  <Edit2 size={17} />
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview note */}
      {slides.length > 0 && (
        <p className="text-xs text-neutral-400 mt-4 text-center">
          Los cambios se reflejan en tiempo real en el Home de la tienda: &nbsp;
          <a href="https://zamisprint.vercel.app" target="_blank" rel="noreferrer" className="text-brand-500 font-semibold hover:underline">zamisprint.vercel.app</a>
        </p>
      )}

      {/* ── Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900">{editingSlide ? 'Editar Slide' : 'Nuevo Slide'}</h3>
              <button onClick={closeForm} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{error}</div>}

              {/* Image Preview */}
              {form.image && (
                <div className="w-full h-36 rounded-xl overflow-hidden bg-neutral-100">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/600x200?text=URL+inválida'; }} />
                </div>
              )}

              {/* Image field — dual mode URL / Upload */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Imagen *</label>

                {/* Mode toggle */}
                <div className="flex rounded-xl overflow-hidden border border-neutral-200 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-colors ${
                      imageMode === 'url' ? 'bg-brand-500 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <Link2 size={15} /> Pegar URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-colors ${
                      imageMode === 'upload' ? 'bg-brand-500 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <UploadCloud size={15} /> Subir desde PC
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <input
                    type="url"
                    value={form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://... (Unsplash, Cloudinary, etc.)"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                ) : (
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      uploading ? 'border-brand-300 bg-brand-50' : 'border-neutral-300 hover:border-brand-400 hover:bg-brand-50/40'
                    }`}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500" />
                        <p className="text-sm font-semibold text-brand-600">Subiendo a Cloudinary...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-500">
                        <UploadCloud size={28} className="text-brand-400" />
                        <p className="text-sm font-semibold">Clic para seleccionar imagen</p>
                        <p className="text-xs text-neutral-400">JPG, PNG o WEBP · Máx 10 MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}

                {form.image && (
                  <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1">
                    ✓ Imagen lista
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Título *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título principal" className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Subtítulo</label>
                  <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Frase corta" className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Descripción</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción breve..." className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Texto del botón</label>
                  <input type="text" value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} placeholder="Ver más" className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Enlace del botón</label>
                  <input type="text" value={form.ctaLink} onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))} placeholder="/shop" className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Orden</label>
                  <input type="number" min={0} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-brand-500' : 'bg-neutral-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-6' : 'left-1'}`} />
                    </div>
                    <span className="text-sm font-semibold text-neutral-700">{form.isActive ? 'Activo' : 'Oculto'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-neutral-100">
              <button onClick={closeForm} className="flex-1 py-2.5 border border-neutral-300 rounded-xl font-bold text-neutral-700 hover:bg-neutral-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? 'Guardando...' : <><Save size={16} /> Guardar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderTab;
