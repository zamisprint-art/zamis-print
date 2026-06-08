import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, Save, X } from 'lucide-react';

const TYPE_TEMPLATES = {
  'newest': {
    emoji: '✨',
    title: 'Recién Salidos de la Impresora'
  },
  'featured': {
    emoji: '⭐',
    title: 'Favoritos de la Comunidad'
  },
  'category': {
    emoji: '🎁',
    title: 'Colección Temática'
  },
  'sale': {
    emoji: '🔥',
    title: 'Aprovecha Antes Que Vuelen'
  },
  'bespoke': {
    emoji: '💎',
    title: 'Galería de Proyectos Premium'
  }
};

const EMPTY_FORM = {
  type: 'newest',
  categoryFilter: '',
  emoji: TYPE_TEMPLATES['newest'].emoji,
  title: TYPE_TEMPLATES['newest'].title,
  linkTo: '/shop',
  linkLabel: 'Ver todo',
  isActive: true,
  order: 0,
};

const TYPE_LABELS = {
  'featured': 'Favoritos (Prueba Social)',
  'sale': 'Ofertas',
  'newest': 'Recién Salidos (Novedades)',
  'category': 'Colección Temática / Nicho',
  'bespoke': 'Proyectos a la Medida',
};

const SectionsTab = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete Modal State
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchSections = async () => {
    try {
      const { data } = await axios.get('/api/homesections/admin');
      setSections(data);
    } catch (err) {
      console.error('Error fetching sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openCreate = () => {
    setEditingSection(null);
    setForm({ ...EMPTY_FORM, order: sections.length });
    setShowForm(true);
    setError('');
  };

  const openEdit = (section) => {
    setEditingSection(section);
    setForm({ ...section });
    setShowForm(true);
    setError('');
  };

  const closeForm = () => { setShowForm(false); setEditingSection(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingSection) {
        await axios.put(`/api/homesections/${editingSection._id}`, form);
      } else {
        await axios.post('/api/homesections', form);
      }
      await fetchSections();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la sección');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (section) => {
    setSectionToDelete(section);
    setDeleteError('');
  };

  const executeDelete = async () => {
    if (!sectionToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await axios.delete(`/api/homesections/${sectionToDelete._id}`);
      await fetchSections();
      setSectionToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError(err.response?.data?.message || 'Error al eliminar la sección');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async (section) => {
    try {
      await axios.put(`/api/homesections/${section._id}`, { isActive: !section.isActive });
      fetchSections();
    } catch (err) {
      console.error(err);
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    setSections(newSections);
    
    const orderedIds = newSections.map(s => s._id);
    await axios.put('/api/homesections/reorder', { orderedIds });
  };

  const moveDown = async (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    setSections(newSections);

    const orderedIds = newSections.map(s => s._id);
    await axios.put('/api/homesections/reorder', { orderedIds });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Secciones del Home</h2>
          <p className="text-sm text-neutral-500 mt-1">Configura las tiras de productos de la página principal.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nueva Sección
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-neutral-500">Cargando secciones...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          {sections.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              No hay secciones configuradas. Crea la primera para armar tu Home.
            </div>
          ) : (
            <div className="flex flex-col">
              {sections.map((section, index) => (
                <div key={section._id} className={`flex items-center gap-4 p-4 border-b border-neutral-100 bg-white transition-colors hover:bg-neutral-50 ${!section.isActive ? 'opacity-60' : ''}`}>
                  
                  {/* Controles de orden */}
                  <div className="flex flex-col items-center gap-1 text-neutral-300">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="hover:text-brand-500 disabled:opacity-30">▲</button>
                    <GripVertical size={16} />
                    <button onClick={() => moveDown(index)} disabled={index === sections.length - 1} className="hover:text-brand-500 disabled:opacity-30">▼</button>
                  </div>

                  <div className="w-12 h-12 flex-shrink-0 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl">
                    {section.emoji}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                        {TYPE_LABELS[section.type]}
                      </span>
                      {section.type === 'category' && (
                        <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                          {section.categoryFilter || 'Todas'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-neutral-900">{section.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleActive(section)}
                      className={`p-2 rounded-xl transition-colors ${section.isActive ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-neutral-400 bg-neutral-100 hover:bg-neutral-200'}`}
                      title={section.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {section.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button onClick={() => openEdit(section)} className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => confirmDelete(section)} className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-neutral-900">
                {editingSection ? 'Editar Sección' : 'Nueva Sección'}
              </h3>
              <button onClick={closeForm} className="text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Tipo de Contenido *</label>
                  <select
                    value={form.type}
                    onChange={e => {
                      const newType = e.target.value;
                      const template = TYPE_TEMPLATES[newType];
                      if (template && !editingSection) {
                        setForm({ ...form, type: newType, ...template });
                      } else {
                        setForm({ ...form, type: newType });
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    required
                  >
                    <option value="newest">Recién Salidos de la Impresora (Novedades)</option>
                    <option value="featured">Favoritos de la Comunidad (Más Vendidos)</option>
                    <option value="category">Colección Temática / Nicho Específico</option>
                    <option value="sale">Ofertas / Descuentos</option>
                    <option value="bespoke">Proyectos a la Medida (Solo Nivel Cotización)</option>
                  </select>
                </div>

                {form.type === 'category' && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Categoría a Mostrar *</label>
                    <select
                      value={form.categoryFilter}
                      onChange={e => setForm({ ...form, categoryFilter: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                      required
                    >
                      <option value="" disabled>Seleccione una categoría</option>
                      <option value="Figuras y Coleccionables">Figuras y Coleccionables</option>
                      <option value="Accesorios y Llaveros">Accesorios y Llaveros</option>
                      <option value="Hogar y Decoración">Hogar y Decoración</option>
                      <option value="Mascotas">Mascotas</option>
                      <option value="Geek & Setup">Geek & Setup</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[80px_1fr] gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Emoji *</label>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={e => setForm({ ...form, emoji: e.target.value })}
                    placeholder="✨"
                    className="w-full text-center px-2 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                    maxLength="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Título Principal *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Texto del enlace (Ej: Ver Todo)</label>
                  <input
                    type="text"
                    value={form.linkLabel}
                    onChange={e => setForm({ ...form, linkLabel: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">URL del enlace</label>
                  <input
                    type="text"
                    value={form.linkTo}
                    onChange={e => setForm({ ...form, linkTo: e.target.value })}
                    placeholder="/shop"
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-neutral-100">
                <button type="button" onClick={closeForm} className="px-6 py-2.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary px-8 flex items-center gap-2">
                  <Save size={18} />
                  {saving ? 'Guardando...' : 'Guardar Sección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {sectionToDelete && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">¿Eliminar sección?</h3>
            <p className="text-neutral-500 mb-6 text-sm">
              Estás a punto de eliminar la sección <strong>"{sectionToDelete.title}"</strong> del Home. Esta acción la quitará de la página principal inmediatamente.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setSectionToDelete(null)} 
                className="flex-1 px-4 py-2.5 rounded-xl text-neutral-600 font-bold bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                onClick={executeDelete} 
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Eliminando</>
                ) : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionsTab;
