import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload, FiCamera, FiX } from 'react-icons/fi';
import { useSimpleExpense } from '../src/context/SimpleExpenseContext';
import { toast } from 'react-toastify';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Drinking',
    subcategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    tags: '',
    isRecurring: false,
    recurringFrequency: ''
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [scannedReceipt, setScannedReceipt] = useState(null); 
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);
  const { createExpense, scanReceipt, uploadReceiptToExpense } = useSimpleExpense();

  const categories = [
    'Food & Drinking', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
    'Groceries', 'Personal Care', 'Other'
  ];

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Other'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanReceipt = async () => {
    if (!receiptFile) {
      toast.error('Please select a receipt image first');
      return;
    }

    setIsScanning(true);
    try {
      const result = await scanReceipt(receiptFile);
      
      if (result.success && result.data.expenseData) {
        const extracted = result.data.expenseData;
        
        
        if (result.data.receipt) {
          setScannedReceipt(result.data.receipt);
        }
        
        
        setFormData(prev => ({
          ...prev,
          amount: extracted.amount || prev.amount,
          category: extracted.category || prev.category,
          subcategory: extracted.subcategory || prev.subcategory,
          description: extracted.description || prev.description,
          date: extracted.date || prev.date,
          paymentMethod: extracted.paymentMethod || prev.paymentMethod,
          tags: extracted.tags || prev.tags
        }));

        toast.success('Receipt scanned successfully! Form auto-filled.');
      } else {
        toast.error(result.message || 'Failed to scan receipt');
      }
    } catch (error) {
      toast.error('Error scanning receipt: ' + (error.message || 'Unknown error'));
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setScannedReceipt(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let expenseDataToSubmit = { ...formData };
      
      
      if (scannedReceipt) {
        expenseDataToSubmit.receipt = scannedReceipt;
      } else if (receiptFile) {
       
        toast.info("Receipt will be uploaded after expense is created");
      }

      const res = await createExpense(expenseDataToSubmit);

      if (res.success) {
        
        if (receiptFile && !scannedReceipt && res.data.newExpense?._id) {
          try {
            await uploadReceiptToExpense(res.data.newExpense._id, receiptFile);
            toast.success("Receipt uploaded successfully!");
          } catch (uploadError) {
            console.error("Error uploading receipt:", uploadError);
           
            toast.warning("Expense created but receipt upload failed");
          }
        }
        
        console.log("Added successfully");
        toast.success("Expense added successfully!");
        navigate('/expense-dashboard');
      } else {
        console.log("Error creating expense", res.message);
        toast.error("Failed to create expense: " + (res.message || 'Unknown error'));
      }
    } catch (error) {
      toast.error("Failed to create expense: " + (error?.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] font-sans selection:bg-yellow-400 selection:text-black">
      
      <header className="bg-[#F0F0F0] border-b-4 md:border-b-8 border-black p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <FiArrowLeft className="text-xl font-black" />
            </button>
            <h1 className="font-black text-xl md:text-3xl uppercase tracking-tight">
              Add Expense
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="bg-white border-4 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            
            <div className="col-span-1 md:col-span-2">
              <label className="block font-black text-lg uppercase mb-2">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-stone-100 border-4 border-black p-4 text-3xl font-black focus:outline-none focus:bg-yellow-100 transition-colors placeholder-gray-400"
                required
              />
            </div>

            
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
              <label className="block font-black text-sm uppercase mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                required
              />
            </div>

            
            <div>
              <label className="block font-black text-sm uppercase mb-2">Payment Method</label>
              <div className="relative">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full appearance-none bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            
            <div>
              <label className="block font-black text-sm uppercase mb-2">Subcategory (Optional)</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="e.g. Lunch, Taxi"
                className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            
            <div className="col-span-1 md:col-span-2">
              <label className="block font-black text-sm uppercase mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="What was this for?"
                className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
              ></textarea>
            </div>

            
            <div className="col-span-1 md:col-span-2">
              <label className="block font-black text-sm uppercase mb-2">Tags (Comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="work, travel, reimbursement"
                className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            
            <div className="col-span-1 md:col-span-2">
              <label className="block font-black text-sm uppercase mb-2">Receipt</label>
              
              {!receiptPreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-black border-dashed bg-stone-50 p-6 text-center cursor-pointer hover:bg-yellow-50 transition-colors"
                >
                  <FiUpload className="mx-auto text-3xl mb-2" />
                  <span className="font-bold text-sm uppercase">Click to upload receipt image</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-4 border-black bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-sm uppercase">Receipt Preview</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleScanReceipt}
                        disabled={isScanning}
                        className="px-4 py-2 bg-blue-600 text-white font-bold uppercase text-xs border-2 border-black hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <FiCamera className="text-sm" />
                        {isScanning ? 'Scanning...' : 'Scan Receipt'}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveReceipt}
                        className="px-4 py-2 bg-red-600 text-white font-bold uppercase text-xs border-2 border-black hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <FiX className="text-sm" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <img 
                    src={receiptPreview} 
                    alt="Receipt preview" 
                    className="max-w-full h-auto max-h-64 mx-auto border-2 border-black"
                  />
                </div>
              )}
              
              <p className="mt-2 text-xs text-gray-600 font-bold">
                💡 Tip: Upload a receipt and click "Scan Receipt" to auto-fill the form!
              </p>
            </div>

           
            <div className="col-span-1 md:col-span-2 flex items-center gap-4 p-4 border-4 border-black bg-blue-100">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="w-6 h-6 border-4 border-black rounded-none focus:ring-0 text-black"
              />
              <label htmlFor="isRecurring" className="font-black text-sm uppercase cursor-pointer select-none">
                This is a recurring expense
              </label>
            </div>

            
            {formData.isRecurring && (
              <div className="col-span-1 md:col-span-2 animate-fade-in">
                <label className="block font-black text-sm uppercase mb-2">Frequency</label>
                <div className="flex flex-wrap gap-3">
                  {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(freq => (
                    <label key={freq} className="cursor-pointer">
                      <input
                        type="radio"
                        name="recurringFrequency"
                        value={freq}
                        checked={formData.recurringFrequency === freq}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="px-4 py-2 border-4 border-black font-bold uppercase bg-white peer-checked:bg-black peer-checked:text-yellow-400 hover:translate-x-1 hover:translate-y-1 transition-all">
                        {freq}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>

         
          <button
            type="submit"
            className="w-full mt-8 bg-black text-yellow-400 font-black text-xl uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <FiSave className="text-2xl" />
            Save Expense
          </button>

        </form>
      </main>
    </div>
  );
};

export default AddExpense;
