import apiConfig from '../configs/api.config';

export const getDevices = async () => {
    const url = `${apiConfig.baseURL}/devices`;

    const accessToken = JSON.parse(localStorage.getItem('tokens')).access.token;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
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

export const addDevice = async (deviceData) => {
    const url = `${apiConfig.baseURL}/devices`;

    const accessToken = JSON.parse(localStorage.getItem('tokens')).access.token;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(deviceData)  // Corrected: Use JSON.stringify() to send the object as JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error occurred while adding the device.');
        }

        const data = await response.json();
        return data;  // Return the response data, typically device data or confirmation
    } catch (error) {
        console.error('Error during device addition:', error);
        throw error;
    }
};
