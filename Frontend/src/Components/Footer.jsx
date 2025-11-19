import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black border-t-4 border-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
       
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-yellow-400 uppercase mb-2">
              ExpenseFlow
            </h2>
            <p className="text-white font-bold text-sm max-w-xs">
              Track every trip, every rupee, effortlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center">
            <Link 
              to="/" 
              className="text-white font-black uppercase text-sm hover:text-yellow-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className="text-white font-black uppercase text-sm hover:text-yellow-400 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="text-white font-black uppercase text-sm hover:text-yellow-400 transition-colors"
            >
              Sign Up
            </Link>
            
          </div>

         
          <div className="flex gap-4">
            <a
              href="https://x.com/Sohaildevs?t=1dwKAOjJgSBlceNYe2AbQA&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-pink-300 border-2 border-white flex items-center justify-center font-black text-xl hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              aria-label="Twitter"
            >
              𝕏
            </a>
            <a
              href="https://www.linkedin.com/in/sohailshaikh786?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-300 border-2 border-white flex items-center justify-center font-black text-xl hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
        </div>

       
        <div className="w-full h-1 bg-yellow-400 mb-6"></div>

       
        <div className="text-center">
          <p className="text-white font-bold text-sm">
            © 2025 <span className="text-yellow-400 font-black">ExpenseFlow</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer