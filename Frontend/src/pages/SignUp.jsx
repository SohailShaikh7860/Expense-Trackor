import React, {useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
    const [error, setError] = useState(null);
    const [name, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate= useNavigate();
    const {register}=useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            const formData = await register(name,email,password)
            console.log(formData);
            setError(null);
            navigate('/login');
        } catch (error) {
            setError("Registration failed. Please try again.");
        }
    }
  return (
     <div className='min-h-screen bg-stone-100'>
          <div className='p-4'>
            <Link to='/'>
              <h1 className='font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-black rounded-2xl bg-yellow-400 inline-block px-2 py-1 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer'>
                ExpenseFlow
              </h1>
            </Link>
          </div>
    <div className="flex justify-center items-center  px-4 py-6 md:py-8 bg-stone-100 ">
      <form className="flex flex-col w-full max-w-md p-6 md:p-5 border-8 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-center mb-3 border-b-4 border-black pb-3">
          Sign Up to ExpenseFlow
        </h2>

        <label
          htmlFor="fullName"
          className="text-black text-lg md:text-xl font-black uppercase mb-2 tracking-tight"
        >
          Full Name
        </label>

        <input
          type="text"
          id="fullName"
          className="mb-4 p-3 border-4 border-black text-base font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white placeholder:text-gray-400"
          placeholder="Enter Your Full Name"
          value={name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label
          htmlFor="email"
          className="text-black text-lg md:text-xl font-black uppercase mb-2 tracking-tight"
        >
          Email
        </label>

        <input
          type="email"
          id="email"
          className="mb-4 p-3 border-4 border-black text-base font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white placeholder:text-gray-400"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <label
          htmlFor="password"
          className="text-black text-lg md:text-xl font-black uppercase mb-2 tracking-tight"
        >
          Password
        </label>

        <input
          type="password"
          id="password"
          className="mb-4 p-3 border-4 border-black text-base font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white placeholder:text-gray-400"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 font-bold mb-4 text-center">{error}</p>}

        <button className="bg-black text-yellow-400 font-black text-xl md:text-2xl uppercase py-3 px-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all mb-2 select-none" type="submit" onClick={handleSubmit}>
          Submit
        </button>

        <div className="flex items-center my-2">
          <div className="flex-1 border-t-4 border-black"></div>
          <span className="px-4 font-black uppercase text-base tracking-wider">
            Or
          </span>
          <div className="flex-1 border-t-4 border-black"></div>
        </div>

        <div className="text-center mt-1">
          <p className="font-bold uppercase text-sm mb-2 tracking-tight">
            Already have an account?
          </p>

          <Link to="/login">
            <button
              type="button"
              className="w-full bg-white text-black font-black text-xl md:text-2xl uppercase py-3 px-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all select-none"
            >
              Login
            </button>
          </Link>
        </div>
      </form>
    </div>
     </div> 
  );
};

export default SignUp;
