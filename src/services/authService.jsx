import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { 
                username, 
                password 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Login failed';
        }
    },

    register: async (username, email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, {
                username,
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Signup failed';
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
    }
}