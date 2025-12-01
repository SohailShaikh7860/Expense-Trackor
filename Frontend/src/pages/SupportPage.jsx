import React, { useEffect } from 'react';
import { useRazorpay } from '../context/razorpayContext';

const Supporters = () => {
  const { supporters, getSupporters, loading } = useRazorpay();

  useEffect(() => {
    getSupporters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h1 className="font-black text-4xl uppercase text-center">Our Supporters</h1>
          <p className="font-bold text-center mt-2">
            Thank you to these amazing people who support ExpenseFlow!
          </p>
        </div>

        
        {loading ? (
          <div className="text-center py-12">
            <p className="font-bold text-xl">Loading supporters...</p>
          </div>
        ) : supporters.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="font-bold text-xl">Be the first supporter!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {supporters.map((supporter, index) => (
              <div
                key={supporter._id}
                className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-yellow-400 border-2 border-black px-3 py-1 font-black text-sm">
                        #{index + 1}
                      </span>
                      <h3 className="font-black text-xl">
                        {supporter.supportName || 'Anonymous'}
                      </h3>
                    </div>
                    {supporter.supportMsg && (
                      <p className="font-bold text-gray-700 mt-3 pl-2 border-l-4 border-black">
                        "{supporter.supportMsg}"
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl text-yellow-600">₹{supporter.amount}</p>
                    <p className="font-bold text-xs text-gray-500 mt-1">
                      {new Date(supporter.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Supporters;