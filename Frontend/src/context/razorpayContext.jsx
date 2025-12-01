import React, {createContext, useContext, useState} from 'react'
import axios from '../config/Axios';

const razorpayContext = createContext();

export const RazorpayProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [supports, setSupports] = useState([]);

    const createOrder = async(supportName, supportMsg) =>{
        try {
            setLoading(true);
            const response = await axios.post('/razorpay/create-order', { supportName, supportMsg });
            return { success: true, ...response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to create order' };
        }finally{
            setLoading(false);
        }
    }

    const verifyPayment = async(paymentData) =>{
        try {
            setLoading(true);
            const response = await axios.post('/razorpay/verify-payment', paymentData);
            return { success: true,...response.data};
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Payment verification failed' };
        }finally{
            setLoading(false);
        }
    }

    const getSupporters = async()=>{
        try {
            setLoading(true);
            const response = await axios.get('/razorpay/supporters');
            setSupports(response.data.supporters || []);
            return { success: true, data: response.data.supporters };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch supporters' };
        }finally{
            setLoading(false);
        }
    }

    const getPayments = async()=>{
        try {
            setLoading(true);
            const response = await axios.get('/razorpay/payments');
            return { success: true, data: response.data.payments };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch payments' };
        }finally{
            setLoading(false);
        }
    };

    const value ={
        loading,
        supports,
        createOrder,
        verifyPayment,
        getSupporters,
        getPayments
    }

  return (
    <razorpayContext.Provider value={value}>
      {children}
    </razorpayContext.Provider>
  )
}

export const useRazorpay = () =>{
    const context = useContext(razorpayContext);
    if(!context){
        throw new Error("useRazorpay must be used within RazorpayProvider");
    }
    return context;
}
