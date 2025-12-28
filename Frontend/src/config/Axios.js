import axios from 'axios';

const instance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json'
    }
});


instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Unauthorized - redirecting to login');
        }
        return Promise.reject(error);
    }
);

export default instance;