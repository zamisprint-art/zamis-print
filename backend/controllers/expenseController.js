import Expense from '../models/Expense.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los gastos' });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private/Admin
const createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    const expense = new Expense({
      description,
      amount,
      category,
      date: date || Date.now()
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(400).json({ message: 'Datos de gasto inválidos', error: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
const updateExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      expense.description = description || expense.description;
      expense.amount = amount || expense.amount;
      expense.category = category || expense.category;
      expense.date = date || expense.date;

      const updatedExpense = await expense.save();
      res.json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Gasto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el gasto', error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      await expense.deleteOne();
      res.json({ message: 'Gasto eliminado' });
    } else {
      res.status(404).json({ message: 'Gasto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el gasto' });
  }
};

export { getExpenses, createExpense, updateExpense, deleteExpense };
