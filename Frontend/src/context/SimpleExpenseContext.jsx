import React, {useContext, createContext, useState} from 'react'
import axios from '../config/Axios'

const SimpleExpenseContext = createContext();


export const SimpleExpenseContextProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [simpleUser, setSimpleUser] = useState(null);

    const createExpense = async(expenseData)=>{
        try {
            const response = await axios.post('/expense',expenseData);
            setSimpleUser(response.data.user);
            setLoading(true);
            return {success:true, data: response.data};
        } catch (error) {
            return {success:false, message: error.response?.data?.message || 'Failed to create expense'};
        }
    }


    const value = {
        createExpense,
        loading,
        simpleUser,
        expenses
    }
  return (
    <SimpleExpenseContext.Provider value={value}>
      {children}
    </SimpleExpenseContext.Provider>
  )
}
export const useSimpleExpense = () => {
    const context = useContext(SimpleExpenseContext);
    if (!context) {
        throw new Error('useSimpleExpense must be used within a SimpleExpenseContextProvider');
    }
    return context;
}

