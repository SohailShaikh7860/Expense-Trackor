import React, { useRef, useState, useEffect, use } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiUser, FiDollarSign, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import { MdDashboard, MdAccountBalanceWallet } from 'react-icons/md';
import { useSimpleExpense } from '../src/context/SimpleExpenseContext';

const ExpenseDashboard = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const {getAllSimpleExpenses, expenses, loading, budget, getAllBudgets} = useSimpleExpense();

  const firstLetter = user?.name?.charAt(0).toUpperCase() || 'U';

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  const fetchExpenses = async()=>{
    try {
      await getAllSimpleExpenses();
      console.log("expenses fetched in dashboard");
    } catch (error) {
      console.log("fetch expenses error:", error);
    }
  }

  const fetchBudgets = async()=>{
    try {
      await getAllBudgets();
      console.log("budgets fetched in dashboard");
    } catch (error) {
      console.log("fetch budgets error:", error);
    }
  }

  
  const calculateStats = () => {
    if (!expenses || expenses.length === 0) {
      return {
        totalExpenses: 0,
        thisMonth: 0,
        totalBudget: 0, 
        categories: [],
        recentExpenses: [],
        budgetByCategory: []
      };
    }

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const thisMonthTotal = thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    
    const categoryMap = {};
    thisMonthExpenses.forEach(exp => {
      if (categoryMap[exp.category]) {
        categoryMap[exp.category] += exp.amount;
      } else {
        categoryMap[exp.category] = exp.amount;
      }
    });

    const colors = ['bg-yellow-400', 'bg-blue-400', 'bg-pink-400', 'bg-green-400', 'bg-purple-400', 'bg-red-400', 'bg-indigo-400', 'bg-orange-400'];
    
    const categories = Object.keys(categoryMap).map((cat, index) => ({
      name: cat,
      amount: categoryMap[cat],
      percentage: Math.round((categoryMap[cat] / thisMonthTotal) * 100),
      color: colors[index % colors.length]
    })).sort((a, b) => b.amount - a.amount);

    
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4)
      .map(exp => ({
        id: exp._id,
        name: exp.description || exp.category,
        amount: exp.amount,
        category: exp.category,
        date: new Date(exp.date).toLocaleDateString()
      }));

    const totalBudget = budget && Array.isArray(budget) 
      ? budget.reduce((acc, b) => acc + (b.limit || 0), 0) 
      : 0;

    const budgetByCategory = budget && Array.isArray(budget)
      ? budget.map(b => {
          const spent = categoryMap[b.category] || 0;
          const percentage = b.limit > 0 ? (spent / b.limit) * 100 : 0;
          return {
            category: b.category,
            limit: b.limit,
            spent: spent,
            remaining: b.limit - spent,
            percentage: percentage,
            status: percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : 'safe'
          };
        }).sort((a, b) => b.percentage - a.percentage)
      : [];

    return {
      totalExpenses,
      thisMonth: thisMonthTotal,
      totalBudget, 
      categories,
      recentExpenses,
      budgetByCategory
    };
  };

  const stats = calculateStats();
  const budgetPercentage = stats.totalBudget > 0 ? (stats.thisMonth / stats.totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-2xl font-black uppercase animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">

      <header className="bg-[#F0F0F0] border-b-8 border-black p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight">
            ExpenseFlow
          </h1>

          
          <div className="relative" >
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-12 h-12 bg-black text-[#F0F0F0] border-4 border-black font-black text-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-full"
            >
              {firstLetter}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" ref={profileMenuRef}>
                
                <div className="p-4 border-b-4 border-black bg-yellow-400">
                  <p className="font-black text-sm uppercase">Hello,</p>
                  <p className="font-black text-lg truncate">{user?.name}</p>
                  <p className="font-bold text-xs truncate">{user?.email}</p>
                </div>

                
                <div className="p-2">
                  <Link to="/expense-dashboard">
                    <button className="w-full flex items-center gap-3 p-3 font-bold hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-black mb-1">
                      <MdDashboard className="text-xl" />
                      <span>Dashboard</span>
                    </button>
                  </Link>

                  <Link to="/expenses">
                    <button className="w-full flex items-center gap-3 p-3 font-bold hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-black mb-1">
                      <FiDollarSign className="text-xl" />
                      <span>Expenses</span>
                    </button>
                  </Link>

                  <Link to="/budget">
                    <button className="w-full flex items-center gap-3 p-3 font-bold hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-black mb-1">
                      <MdAccountBalanceWallet className="text-xl" />
                      <span>Budget</span>
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 font-bold hover:bg-red-400 transition-colors border-2 border-transparent hover:border-black"
                  >
                    <FiLogOut className="text-xl" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <p className="font-black uppercase text-sm">Total Expenses</p>
              <FiTrendingUp className="text-2xl" />
            </div>
            <p className="font-black text-3xl">₹{stats.totalExpenses.toLocaleString()}</p>
            <p className="font-bold text-xs mt-2 text-gray-600">All time</p>
          </div>

          
          <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <p className="font-black uppercase text-sm">This Month</p>
              <FiDollarSign className="text-2xl" />
            </div>
            <p className="font-black text-3xl">₹{stats.thisMonth.toLocaleString()}</p>
            <p className="font-bold text-xs mt-2">December 2024</p>
          </div>

          
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <p className="font-black uppercase text-sm">Budget Left</p>
              <MdAccountBalanceWallet className="text-2xl" />
            </div>
            <p className="font-black text-3xl">₹{(stats.totalBudget - stats.thisMonth).toLocaleString()}</p>
            <div className="mt-3">
              <div className="flex justify-between font-bold text-xs mb-1">
                <span>{budgetPercentage.toFixed(0)}% used</span>
                <span>₹{stats.totalBudget.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-gray-200 border-2 border-black">
                <div
                  className={`h-full ${budgetPercentage > 90 ? 'bg-red-500' : budgetPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-4 border-black">
                <FiPieChart className="text-2xl" />
                <h2 className="font-black text-xl uppercase">Category Breakdown</h2>
              </div>

              
              <div className="space-y-4">
                {stats.categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-black text-sm uppercase">{category.name}</span>
                      <span className="font-bold text-sm">₹{category.amount.toLocaleString()} ({category.percentage}%)</span>
                    </div>
                    <div className="h-8 bg-gray-200 border-4 border-black relative overflow-hidden">
                      <div
                        className={`h-full ${category.color} flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{ width: `${category.percentage}%` }}
                      >
                        <span className="font-black text-xs">{category.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              
              <div className="mt-6 pt-4 border-t-4 border-black">
                <p className="font-black text-xs uppercase mb-3">Total: ₹{stats.thisMonth.toLocaleString()}</p>
                <div className="flex flex-wrap gap-3">
                  {stats.categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-4 h-4 ${category.color} border-2 border-black`} />
                      <span className="font-bold text-xs">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black text-xl uppercase mb-4 pb-3 border-b-4 border-black">
                Recent Expenses
              </h2>

              <div className="space-y-3">
                {stats.recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-3 border-2 border-black hover:bg-yellow-400 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-black text-sm">{expense.name}</p>
                      <p className="font-black text-sm">₹{expense.amount}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold px-2 py-1 bg-gray-200 border border-black">
                        {expense.category}
                      </span>
                      <span className="text-xs font-bold text-gray-600">{expense.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/expenses">
                <button className="w-full mt-4 bg-black text-yellow-400 font-black uppercase py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  View All
                </button>
              </Link>
            </div>
          </div>
        </div>

       
        {stats.budgetByCategory.length > 0 && (
          <div className="mt-6">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black text-xl uppercase mb-4 pb-3 border-b-4 border-black">
                Budget Limits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.budgetByCategory.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-4 border-4 border-black ${
                      item.status === 'danger' ? 'bg-red-100' : 
                      item.status === 'warning' ? 'bg-yellow-100' : 
                      'bg-green-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-sm uppercase">{item.category}</p>
                        <p className="font-bold text-xs text-gray-600 mt-1">
                          ₹{item.spent.toLocaleString()} / ₹{item.limit.toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-black border-2 border-black ${
                        item.status === 'danger' ? 'bg-red-500 text-white' : 
                        item.status === 'warning' ? 'bg-yellow-500' : 
                        'bg-green-500 text-white'
                      }`}>
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-4 bg-white border-2 border-black">
                      <div
                        className={`h-full ${
                          item.status === 'danger' ? 'bg-red-500' : 
                          item.status === 'warning' ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="font-bold text-xs mt-2">
                      Remaining: ₹{item.remaining.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        
        <div className="mt-6">
          <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-black text-xl uppercase mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/add-expense" className="bg-white border-4 border-black p-4 font-black uppercase text-sm hover:bg-black hover:text-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                + Add Expense
              </Link>
              <Link to="/budget" className="bg-white border-4 border-black p-4 font-black uppercase text-sm hover:bg-black hover:text-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                Set Budget
              </Link>
              <button className="bg-white border-4 border-black p-4 font-black uppercase text-sm hover:bg-black hover:text-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                View Reports
              </button>
              <button className="bg-white border-4 border-black p-4 font-black uppercase text-sm hover:bg-black hover:text-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpenseDashboard;