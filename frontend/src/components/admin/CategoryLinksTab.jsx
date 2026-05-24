import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, Save, X, Image, UploadCloud } from 'lucide-react';

const EMPTY_FORM = { title: '', image: '', linkTo: '/shop', isActive: true, order: 0 };

const CategoryLinksTab = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Delete modal
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categorylinks');
      setLinks(data);
    } catch (err) {
      setError('Error cargando categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

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
      setError(err.response?.data?.message || 'Error subiendo imagen.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openCreate = () => {
    setEditingLink(null);
    setForm({ ...EMPTY_FORM, order: links.length });
    setShowForm(true);
    setError('');
  };

  const openEdit = (link) => {
    setEditingLink(link);
    setForm({ ...link });
    setShowForm(true);
    setError('');
  };

  const closeForm = () => { setShowForm(false); setEditingLink(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.title || !form.image) { setError('El título y la imagen son obligatorios.'); return; }
    setSaving(true);
    setError('');
    try {
      if (editingLink) {
        await axios.put(`/api/categorylinks/${editingLink._id}`, form);
      } else {
        await axios.post('/api/categorylinks', form);
      }
      await fetchLinks();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error guardando categoría');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/categorylinks/${linkToDelete._id}`);
      setLinks(prev => prev.filter(l => l._id !== linkToDelete._id));
      setLinkToDelete(null);
    } catch {
      setError('Error al eliminar la categoría.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async (link) => {
    try {
      await axios.put(`/api/categorylinks/${link._id}`, { ...link, isActive: !link.isActive });
      setLinks(prev => prev.map(l => l._id === link._id ? { ...l, isActive: !l.isActive } : l));
    } catch {
      setError('Error actualizando categoría');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900">Accesos Rápidos (Categorías)</h3>
          <p className="text-sm text-neutral-500 mt-1">Aparecen como burbujas debajo del banner principal.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-colors shadow-md shadow-brand-500/30"
        >
          <Plus size={18} /> Nueva Categoría
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-neutral-500">Cargando...</div>
      ) : links.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 border-2 border-dashed border-neutral-200 rounded-2xl">
          <Image size={40} className="text-neutral-300" />
          <div>
            <p className="font-bold text-neutral-600">No hay accesos rápidos aún</p>
            <p className="text-sm text-neutral-400 mt-1">Crea el primer acceso rápido para el Home</p>
          </div>
          <button onClick={openCreate} className="px-5 py-2 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors">
            Crear categoría
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link, idx) => (
            <div
              key={link._id}
              className={`flex gap-4 items-center p-4 rounded-2xl border ${link.isActive ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50 opacity-60'} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex flex-col items-center gap-1 text-neutral-400 shrink-0">
                <GripVertical size={16} />
                <span className="text-xs font-bold text-neutral-500">#{link.order || idx + 1}</span>
              </div>

              <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                <img src={link.image} alt={link.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Error'; }} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-neutral-900 truncate">{link.title}</h3>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">Link: {link.linkTo}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(link)}
                  className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-brand-600 transition-colors"
                  title={link.isActive ? 'Ocultar' : 'Activar'}
                >
                  {link.isActive ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
                <button
                  onClick={() => openEdit(link)}
                  className="p-2 rounded-lg hover:bg-brand-50 text-neutral-500 hover:text-brand-600 transition-colors"
                  title="Editar"
                >
                  <Edit2 size={17} />
                </button>
                <button
                  onClick={() => setLinkToDelete(link)}
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

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h3 className="text-xl font-bold">{editingLink ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={closeForm} className="p-2 hover:bg-neutral-200 rounded-full text-neutral-500"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
              
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Título (Corto)</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" placeholder="Ej. Figuras" />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Imagen (500x500px recomendado)</label>
                <div className="flex flex-col gap-3">
                  {form.image ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-100 mx-auto">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setForm({...form, image: ''})} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Trash2 size={24} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors">
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                      <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex flex-col items-center justify-center w-full gap-2 text-brand-600 font-medium">
                        {uploading ? <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /> : <UploadCloud size={32} />}
                        <span>{uploading ? 'Subiendo...' : 'Subir imagen cuadrada'}</span>
                      </button>
                    </div>
                  )}
                  <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field text-sm" placeholder="O pega la URL de la imagen aquí..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Enlace destino</label>
                <input type="text" value={form.linkTo} onChange={e => setForm({...form, linkTo: e.target.value})} className="input-field" placeholder="/shop?category=Figuras" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Orden</label>
                  <input type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} className="input-field" />
                </div>
                <div className="flex items-center gap-3 mt-7">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-5 h-5 rounded border-neutral-300 text-brand-500 focus:ring-brand-500" />
                  <label htmlFor="isActive" className="text-sm font-bold text-neutral-700 cursor-pointer">Visible en Home</label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
              <button onClick={closeForm} className="px-5 py-2.5 rounded-xl font-bold text-neutral-600 hover:bg-neutral-200 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-colors shadow-md disabled:opacity-50">
                {saving ? 'Guardando...' : <><Save size={18} /> Guardar Categoría</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {linkToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar esta categoría?</h3>
            <p className="text-neutral-500 mb-6 text-sm">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setLinkToDelete(null)} className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-bold transition-colors">Cancelar</button>
              <button onClick={executeDelete} disabled={isDeleting} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryLinksTab;
