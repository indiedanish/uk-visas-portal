import apiConfig from '../configs/api.config';

export const signInUser = async (email, password) => {
    const url = `${apiConfig.baseURL}/auth/login`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed. Please check your credentials.');
        }

        const data = await response.json();
        return data;  // Assume API returns user data under 'user' key
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
