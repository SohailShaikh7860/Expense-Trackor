import React, {createContext, useContext, useState, useEffect} from 'react'
import axios from '../config/Axios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const [isAuthenticated,setIsAuthenticated]=useState(false);
 
    useEffect(()=>{
        checkAuth();
    },[]);

    const checkAuth = async()=>{
          try {
            const response = await axios.get('/user/getCurrentUser');
            console.log("user data:",response.data.user.name);
            setUser(response.data.user);
            setIsAuthenticated(true);
          } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            console.log("Not authenticated", error);
          } finally{
            setLoading(false);
          }
    }

    const login = async(email, password) => {
         try {
            
            const response = await axios.post('/user/login',{email,password});
            setIsAuthenticated(true);
            setUser(response.data.user);
            return {success: true};
         } catch (error) {
            return{
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }
         }   
    }

    const register = async(name,email,password,userType)=>{
        try{
            const response = await axios.post('/user/register',{name,email,password,userType});
            setUser(response.data.user);
            setIsAuthenticated(true);
            return {success: true};
        }catch(error){
            return{
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            }
        }
    }

    const logOut = async()=>{
        try {
            const response = await axios.post('/user/logout');
            setIsAuthenticated(false);
            setUser(null);
            return {success: true};
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Logout failed'
            }
        }
    }

    const value ={
        user,
        loading,
        isAuthenticated,
        login,
        logOut,
        register,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
