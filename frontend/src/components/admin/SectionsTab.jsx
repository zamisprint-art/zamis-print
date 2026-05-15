import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, Save, X } from 'lucide-react';

const EMPTY_FORM = {
  type: 'featured',
  categoryFilter: '',
  emoji: '✨',
  label: 'Lo mejor de ZAMIS',
  title: 'Productos Destacados',
  description: 'Seleccionados a mano por su calidad.',
  linkTo: '/shop',
  linkLabel: 'Ver todo',
  isActive: true,
  order: 0,
};

const TYPE_LABELS = {
  'featured': 'Destacados',
  'sale': 'En Oferta',
  'newest': 'Novedades',
  'category': 'Por Categoría',
};

const SectionsTab = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta sección del home?')) return;
    try {
      await axios.delete(`/api/homesections/${id}`);
      fetchSections();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
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
          <h2 className="text-2xl font-extrabold text-neutral-900">Secciones del Home</h2>
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
                    <p className="text-sm text-neutral-500 line-clamp-1">{section.description}</p>
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
                    <button onClick={() => handleDelete(section._id)} className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
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
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  >
                    <option value="featured">Productos Destacados</option>
                    <option value="sale">En Oferta</option>
                    <option value="newest">Recién Llegados (Novedades)</option>
                    <option value="category">Por Categoría Específica</option>
                  </select>
                </div>

                {form.type === 'category' ? (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Categoría a Mostrar</label>
                    <input
                      type="text"
                      value={form.categoryFilter}
                      onChange={e => setForm({ ...form, categoryFilter: e.target.value })}
                      placeholder="Ej: Figuras, Decoración, Llaveros..."
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Emoji *</label>
                    <input
                      type="text"
                      value={form.emoji}
                      onChange={e => setForm({ ...form, emoji: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                )}
              </div>

              {form.type === 'category' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Emoji *</label>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={e => setForm({ ...form, emoji: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Label superior (Ej: Lo mejor) *</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={e => setForm({ ...form, label: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
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

              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                ></textarea>
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
    </div>
  );
};

export default SectionsTab;
