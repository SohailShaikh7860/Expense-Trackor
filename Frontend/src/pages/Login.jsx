import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from '../config/Axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate=useNavigate();
  const [error,setError]=useState(null);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const handleSubmit= async (e)=>{
    e.preventDefault();

    if(!email || !password){
      setError("All fields are required");
      return;
    }

    try {
      const formData = await axios.post('/user/login',{email,password});
      console.log(formData.data);
      navigate('/dashboard');
    } catch (error) {
      console.log("There was an error", error);
      setError("Invalid email or password");
    }
    
  }

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-120px)] px-4 py-12 bg-stone-100'>
      <form className='flex flex-col w-full max-w-md p-6 md:p-6 border-8 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]' >
        <h2 className='text-2xl md:text-3xl font-black uppercase text-center mb-5 border-b-4 border-black pb-3'>Login to ExpenseFlow</h2>

        <label htmlFor="email" className='text-black text-lg md:text-xl font-black uppercase mb-2 tracking-tight'>
            Email
        </label>

        <input type="email" id='email' className='mb-4 p-3 border-4 border-black text-base font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white placeholder:text-gray-400' placeholder='Enter Your Email' 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
        />

        <label htmlFor="password" className='text-black text-lg md:text-xl font-black uppercase mb-2 tracking-tight'>
            Password
        </label>

         <input type="password" id='password' className='mb-4 p-3 border-4 border-black text-base font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white placeholder:text-gray-400' placeholder='Enter Your Password' 
         value={password}
         onChange={(e)=>setPassword(e.target.value)}
        required
        />

        {error && <p className='text-red-600 font-bold mb-4 text-center'>{error}</p>}

        <Link to="/forgot" className='text-center mb-4 font-bold uppercase text-xs md:text-sm underline decoration-4 decoration-black hover:bg-black hover:text-yellow-400 transition-colors px-2 py-1 inline-block self-center'>
        Forgot Password?
        </Link>

        <button className='bg-black text-yellow-400 font-black text-xl md:text-2xl uppercase py-3 px-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all mb-4 select-none' type='submit' onClick={handleSubmit}>Submit</button>

        <div className='flex items-center my-3'>
          <div className='flex-1 border-t-4 border-black'></div>
          <span className='px-4 font-black uppercase text-base tracking-wider'>Or</span>
          <div className='flex-1 border-t-4 border-black'></div>
        </div>

        {/* Sign Up Section */}
        <div className='text-center mt-3'>
          <p className='font-bold uppercase text-sm mb-3 tracking-tight'>
            Don't have an account?
          </p>
          
          <Link to='/signup'>
            <button 
              type='button'
              className='w-full bg-white text-black font-black text-xl md:text-2xl uppercase py-3 px-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all select-none'
              
              >
              Create Account
            </button>
              </Link>
        </div>
        
      </form>
    </div>
  )
}

export default Login