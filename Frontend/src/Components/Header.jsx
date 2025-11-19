import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="p-4 border-b-4 border-black flex justify-center sm:justify-between items-center relative">
      <h1 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-black rounded-2xl bg-yellow-400 inline-block px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform sm:translate-x-16">
        ExpenseFlow
      </h1>

     <Link to="/login"
     className="font-black text-[15px] md:text-1xl uppercase text-black rounded-2xl bg-yellow-400 px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform  hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all cursor-pointer hidden sm:block sm:mr-15"
     >
        Login/SignUp
     </Link>
    </div>
  );
};

export default Header;
