import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../ui/ConfirmModal';

const ExpensesTab = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Materiales',
    date: new Date().toISOString().split('T')[0]
  });

  // Confirm Modal State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Aceptar',
    variant: 'primary',
    onConfirm: () => {}
  });

  const openConfirm = (options) => {
    setConfirmConfig({ ...confirmConfig, ...options, isOpen: true });
  };

  const categories = ['Materiales', 'Envíos', 'Marketing', 'Mantenimiento', 'Otros'];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/expenses');
      setExpenses(data);
    } catch (error) {
      toast.error('Error al cargar los gastos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionText = editingId ? 'guardar los cambios en este gasto' : 'registrar este nuevo gasto';
    openConfirm({
      title: editingId ? 'Guardar Cambios' : 'Registrar Gasto',
      message: `¿Estás seguro de ${actionText}?`,
      confirmText: editingId ? 'Sí, Guardar' : 'Sí, Registrar',
      variant: 'primary',
      onConfirm: async () => {
        try {
          if (editingId) {
            await axios.put(`/api/expenses/${editingId}`, formData);
            toast.success('Gasto actualizado exitosamente');
          } else {
            await axios.post('/api/expenses', formData);
            toast.success('Gasto registrado exitosamente');
          }
          setIsModalOpen(false);
          fetchExpenses();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Error al guardar el gasto');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    openConfirm({
      title: 'Eliminar Gasto',
      message: '¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer.',
      confirmText: 'Sí, Eliminar',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/expenses/${id}`);
          toast.success('Gasto eliminado');
          fetchExpenses();
        } catch (error) {
          toast.error('Error al eliminar el gasto');
        }
      }
    });
  };

  const openModal = (expense = null) => {
    if (expense) {
      setEditingId(expense._id);
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0]
      });
    } else {
      setEditingId(null);
      setFormData({
        description: '',
        amount: '',
        category: 'Materiales',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Control de Gastos</h2>
          <p className="text-neutral-500">Registra y administra las salidas de dinero</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Gasto
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Total Gastos (Filtrados)</p>
          <p className="text-3xl font-black text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por descripción o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Categoría</th>
                <th className="px-6 py-4 font-semibold">Descripción</th>
                <th className="px-6 py-4 font-semibold">Monto</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {new Date(expense.date).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-900 font-medium">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(expense)}
                        className="p-2 text-neutral-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-neutral-500">
                    No se encontraron gastos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
              <h3 className="text-xl font-bold text-neutral-900">
                {editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">
                  Descripción {formData.category === 'Otros' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  placeholder="Ej. Compra de PLA rojo 1kg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Monto (COP)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-600 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors"
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal {...confirmConfig} onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })} />
    </div>
  );
};

export default ExpensesTab;
