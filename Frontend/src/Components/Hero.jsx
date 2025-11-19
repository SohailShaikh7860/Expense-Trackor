import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center py-15">
        <h1 className="text-black font-black text-3xl sm:text-5xl text-center relative">
          Track Smarter with{" "}
          <span className="inline-block transform -rotate-2 bg-yellow-400 px-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            ExpenseFlow
          </span>
        </h1>

        <p className="text-black text-base sm:text-lg md:text-xl text-center font-medium max-w-2xl mt-4">
          A smart and simple expense tracker for transport owners and
          individuals — track every trip, every rupee, effortlessly with{" "}
          <span className=" underline decoration-amber-800 decoration-2 underline-offset-4 font-bold">
            ExpenseFlow
          </span>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mt-6">
          <Link
            to="/login"
            className="font-black text-[15px] md:text-1xl uppercase text-black rounded-2xl bg-yellow-400 px-6 py-3 border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform  hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all cursor-pointer  select-none"
          >
            Get Started - It's Free
          </Link>

          <button className="font-black text-[15px] md:text-1xl uppercase text-black rounded-2xl bg-yellow-400 px-6 py-3 border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform  hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all cursor-pointer select-none">
            Get Preview
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-9 font-bold text-center sm:gap-12">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-yellow-400 rounded-sm border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ✓
            </span>
            <p>Easy to use</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-yellow-400 rounded-sm border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ⏱
            </span>
            <p>No time limit on free account</p>
          </div>
        </div>

        <h1 className="mt-10 text-xl sm:text-3xl font-black text-center">
          Why Choose <span className="text-gray-400">ExpenseFlow?</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full max-w-6xl px-4">
          <div className="border-2 border-black p-8 bg-purple-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="font-black text-xl uppercase mb-3 leading-tight">
              Track Every Trip
            </h3>
            <p className="font-bold text-sm leading-relaxed">
              Monitor income, expenses, and profit for each journey in
              real-time.
            </p>
          </div>

          <div className="border-2 border-black p-8 bg-yellow-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="font-black text-xl uppercase mb-3 leading-tight">
              Smart Analytics
            </h3>
            <p className="font-bold text-sm leading-relaxed">
              Visualize expenses with pie charts and detailed breakdowns.
            </p>
          </div>

          <div className="border-2 border-black p-8 bg-pink-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="font-black text-xl uppercase mb-3 leading-tight">
              Export to PDF
            </h3>
            <p className="font-bold text-sm leading-relaxed">
              Download professional trip reports with one click.
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl my-10 flex items-center gap-4">
          <div className="flex-1 h-1 bg-black"></div>
          <div className="w-4 h-4 bg-yellow-400 border-2 border-black transform rotate-45"></div>
          <div className="w-4 h-4 bg-black border-2 border-black transform rotate-45"></div>
          <div className="w-4 h-4 bg-yellow-400 border-2 border-black transform rotate-45"></div>
          <div className="flex-1 h-1 bg-black"></div>
        </div>

        {/* Stats Section */}
       <div className="flex flex-wrap justify-center gap-8 mt-14 w-full max-w-4xl px-4">
          <div className="border-2 border-black p-8 bg-yellow-400 min-w-[160px] text-center transform -rotate-2 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
            <p className="text-5xl font-black">500+</p>
            <p className="font-bold uppercase text-sm mt-2">Trips Tracked</p>
          </div>

          <div className="border-2 border-black p-8 bg-white min-w-[160px] text-center transform rotate-1 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
            <p className="text-5xl font-black">100%</p>
            <p className="font-bold uppercase text-sm mt-2">Free Forever</p>
          </div>

          <div className="border-2 border-black p-8 bg-yellow-400 min-w-[160px] text-center transform -rotate-1 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
            <p className="text-5xl font-black">24/7</p>
            <p className="font-bold uppercase text-sm mt-2">Access Anywhere</p>
          </div>
        </div>

        <div className="mt-16 w-full max-w-3xl px-4">
          <h2 className="font-black text-2xl sm:text-3xl uppercase text-center mb-8 border-b-4 border-black inline-block pb-2">
            How It Works
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-400 border-4 border-black flex items-center justify-center font-black text-xl flex-shrink-0 transform -rotate-3">
                1
              </div>
              <div>
                <h3 className="font-black text-lg uppercase">Create Account</h3>
                <p className="font-bold text-sm">
                  Sign up for free in under 30 seconds
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-yellow-400 border-4 border-black flex items-center justify-center font-black text-xl flex-shrink-0 transform rotate-2">
                2
              </div>
              <div>
                <h3 className="font-black text-lg uppercase">
                  Add Trip Details
                </h3>
                <p className="font-bold text-sm">
                  Enter vehicle, route, and expenses
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-400 border-4 border-black flex items-center justify-center font-black text-xl flex-shrink-0 transform -rotate-2">
                3
              </div>
              <div>
                <h3 className="font-black text-lg uppercase">Track & Export</h3>
                <p className="font-bold text-sm">
                  View analytics and download PDFs
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default Hero;
