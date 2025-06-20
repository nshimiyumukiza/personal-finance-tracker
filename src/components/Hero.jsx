import React, { useState, useEffect, useReducer } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Download, DollarSign, Calendar, Tag } from 'lucide-react';

// Expense reducer for state management
const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return [...state, { ...action.payload, id: Date.now() }];
    case 'UPDATE_EXPENSE':
      return state.map(expense => 
        expense.id === action.payload.id ? action.payload : expense
      );
    case 'DELETE_EXPENSE':
      return state.filter(expense => expense.id !== action.payload);
    case 'LOAD_EXPENSES':
      return action.payload;
    default:
      return state;
  }
};

// Categories for expenses
const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Other'
];

// ExpenseForm Component
const ExpenseForm = ({ onAddExpense, editingExpense, onUpdateExpense, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData(editingExpense);
    }
  }, [editingExpense]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };

      if (editingExpense) {
        onUpdateExpense(expenseData);
      } else {
        onAddExpense(expenseData);
      }

      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setErrors({});
      setIsLoading(false);
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter expense title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add notes about this expense..."
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingExpense ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </>
            )}
          </button>
          
          {editingExpense && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ExpenseFilter Component
const ExpenseFilter = ({ filters, onFilterChange, onSearch, expenses }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Amount', 'Category', 'Date', 'Description'];
    const csvData = expenses.map(expense => [
      expense.title,
      expense.amount,
      expense.category,
      expense.date,
      expense.description || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
};

// ExpenseList Component
const ExpenseList = ({ expenses, onEditExpense, onDeleteExpense }) => {
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    // Simulate API call
    setTimeout(() => {
      onDeleteExpense(id);
      setDeleteLoading(null);
    }, 500);
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-gray-400 mb-4">
          <DollarSign className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">No expenses found</p>
          <p className="text-sm">Add your first expense to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                    {expense.description && (
                      <div className="text-sm text-gray-500">{expense.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">
                    ${expense.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleteLoading === expense.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deleteLoading === expense.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ExpenseSummary Component
const ExpenseSummary = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <DollarSign className="w-8 h-8 mr-3" />
          <div>
            <p className="text-sm opacity-90">Total Expenses</p>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Filter className="w-8 h-8 mr-3" />
          <div>
            <p className="text-sm opacity-90">Total Transactions</p>
            <p className="text-2xl font-bold">{expenses.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Tag className="w-8 h-8 mr-3" />
          <div>
            <p className="text-sm opacity-90">Average Expense</p>
            <p className="text-2xl font-bold">
              ${expenses.length ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {sortedCategories.length > 0 && (
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
          <div className="space-y-3">
            {sortedCategories.map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const ExpenseTracker = () => {
  const [expenses, dispatch] = useReducer(expenseReducer, []);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      dispatch({ type: 'LOAD_EXPENSES', payload: JSON.parse(savedExpenses) });
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Filter expenses based on filters and search term
  useEffect(() => {
    let filtered = expenses;

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    // Apply date range filter
    if (filters.startDate) {
      filtered = filtered.filter(expense => expense.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(expense => expense.date <= filters.endDate);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredExpenses(filtered);
  }, [expenses, filters, searchTerm]);

  const handleAddExpense = (expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const handleUpdateExpense = (expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Finance Tracker</h1>
          <p className="text-gray-600">Keep track of your expenses and manage your budget</p>
        </div>

        <ExpenseSummary expenses={filteredExpenses} />

        <ExpenseForm
          onAddExpense={handleAddExpense}
          editingExpense={editingExpense}
          onUpdateExpense={handleUpdateExpense}
          onCancelEdit={handleCancelEdit}
        />

        <ExpenseFilter
          filters={filters}
          onFilterChange={setFilters}
          onSearch={setSearchTerm}
          expenses={filteredExpenses}
        />

        <ExpenseList
          expenses={filteredExpenses}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>
    </div>
  );
};

export default ExpenseTracker;