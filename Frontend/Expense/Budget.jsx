import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { MdAccountBalanceWallet } from 'react-icons/md';

const Budget = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    category: 'Food & Drinking',
    limit: '',
    period: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  const categories = [
    'Food & Drinking', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
    'Groceries', 'Personal Care', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Creating budget:', formData);
    setShowAddForm(false);
    
    setFormData({
      category: 'Food & Drinking',
      limit: '',
      period: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });
  };

  
  const mockBudgets = [
    { id: 1, category: 'Food & Drinking', limit: 5000, spent: 3200, period: 'Monthly', startDate: '2024-12-01', endDate: '2024-12-31' },
    { id: 2, category: 'Transportation', limit: 3000, spent: 2100, period: 'Monthly', startDate: '2024-12-01', endDate: '2024-12-31' },
    { id: 3, category: 'Shopping', limit: 4000, spent: 3800, period: 'Monthly', startDate: '2024-12-01', endDate: '2024-12-31' },
  ];

  useEffect(() => {
    setBudgets(mockBudgets);
  }, []);

  const calculatePercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-stone-100">
      
      <header className="bg-yellow-400 border-b-4 md:border-b-8 border-black p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <FiArrowLeft className="text-xl font-black" />
            </button>
            <div className="flex items-center gap-2">
              <MdAccountBalanceWallet className="text-3xl font-black" />
              <h1 className="font-black text-xl md:text-3xl uppercase tracking-tight">
                Budget Manager
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-black text-yellow-400 font-black uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
          >
            <FiPlus className="text-xl" />
            <span className="hidden md:inline">New Budget</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {showAddForm && (
          <div className="mb-8 bg-white border-4 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
            <h2 className="font-black text-2xl uppercase mb-6 pb-4 border-b-4 border-black">
              Create New Budget
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block font-black text-sm uppercase mb-2">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full appearance-none bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              
              <div>
                <label className="block font-black text-sm uppercase mb-2">Budget Limit (₹)</label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  placeholder="5000"
                  className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-black text-sm uppercase mb-2">Period</label>
                <div className="flex gap-2">
                  {['Weekly', 'Monthly', 'Yearly'].map(period => (
                    <label key={period} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="period"
                        value={period}
                        checked={formData.period === period}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="p-3 border-4 border-black font-bold uppercase text-center bg-white peer-checked:bg-black peer-checked:text-yellow-400 hover:translate-x-1 hover:translate-y-1 transition-all text-xs md:text-sm">
                        {period}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-sm uppercase mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-yellow-400 font-black text-lg uppercase py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Create Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-white text-black font-black text-lg uppercase py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-8">
          <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <FiTrendingUp className="text-3xl" />
              <h2 className="font-black text-2xl uppercase">Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border-4 border-black p-4">
                <p className="font-bold text-xs uppercase mb-1">Total Budgets</p>
                <p className="font-black text-3xl">{budgets.length}</p>
              </div>
              <div className="bg-white border-4 border-black p-4">
                <p className="font-bold text-xs uppercase mb-1">Total Limit</p>
                <p className="font-black text-3xl">₹{budgets.reduce((acc, b) => acc + b.limit, 0).toLocaleString()}</p>
              </div>
              <div className="bg-white border-4 border-black p-4">
                <p className="font-bold text-xs uppercase mb-1">Total Spent</p>
                <p className="font-black text-3xl">₹{budgets.reduce((acc, b) => acc + b.spent, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

    
        <div className="space-y-4">
          <h2 className="font-black text-2xl uppercase mb-4">Active Budgets</h2>
          
          {budgets.length === 0 ? (
            <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <MdAccountBalanceWallet className="text-6xl mx-auto mb-4 opacity-20" />
              <p className="font-black text-xl uppercase mb-2">No Budgets Yet</p>
              <p className="font-bold text-sm mb-4">Create your first budget to start tracking!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-black text-yellow-400 font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Create Budget
              </button>
            </div>
          ) : (
            budgets.map((budget) => {
              const percentage = calculatePercentage(budget.spent, budget.limit);
              const progressColor = getProgressColor(percentage);
              
              return (
                <div key={budget.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl uppercase mb-1">{budget.category}</h3>
                      <p className="font-bold text-sm text-gray-600">
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 border-4 border-black bg-white hover:bg-yellow-400 transition-colors">
                        <FiEdit2 className="text-lg" />
                      </button>
                      <button className="p-2 border-4 border-black bg-white hover:bg-red-400 transition-colors">
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm uppercase">Spent</span>
                      <span className="font-black text-lg">₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}</span>
                    </div>

                    
                    <div className="h-8 bg-gray-200 border-4 border-black relative overflow-hidden">
                      <div
                        className={`h-full ${progressColor} flex items-center justify-center transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="font-black text-xs text-white drop-shadow-lg">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className={`font-black text-sm uppercase px-2 py-1 border-2 border-black ${
                        percentage >= 90 ? 'bg-red-200' : percentage >= 75 ? 'bg-yellow-200' : 'bg-green-200'
                      }`}>
                        {budget.period}
                      </span>
                      <span className="font-bold text-sm">
                        ₹{(budget.limit - budget.spent).toLocaleString()} remaining
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Budget;
