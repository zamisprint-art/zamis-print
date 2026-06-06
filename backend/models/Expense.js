import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Por favor ingresa una descripción del gasto']
  },
  amount: {
    type: Number,
    required: [true, 'Por favor ingresa el monto del gasto']
  },
  category: {
    type: String,
    required: [true, 'Por favor selecciona una categoría'],
    enum: ['Materiales', 'Envíos', 'Marketing', 'Mantenimiento', 'Otros']
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
