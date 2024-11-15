import apiConfig from '../configs/api.config';

export const getAds = async () => {
    const url = `${apiConfig.baseURL}/ads`;

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

export const addAd = async (adData) => {
    const url = `${apiConfig.baseURL}/ads`;

    const accessToken = JSON.parse(localStorage.getItem('tokens')).access.token;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            body: adData // Corrected: Use JSON.stringify() to send the object as JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error occurred while adding the ad.');
        }

        const data = await response.json();
        return data;  // Return the response data, typically ad data or confirmation
    } catch (error) {
        console.error('Error during ad addition:', error);
        throw error;
}
};


export const updateAd = async (adData, adId) => {
    const url = `${apiConfig.baseURL}/ads/${adId}`;

    const accessToken = JSON.parse(localStorage.getItem('tokens')).access.token;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            body: adData // Corrected: Use JSON.stringify() to send the object as JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error occurred while adding the ad.');
        }

        const data = await response.json();
        return data;  // Return the response data, typically ad data or confirmation
    } catch (error) {
        console.error('Error during ad addition:', error);
        throw error;
    }
};


export const deleteAd = async (adId) => {
    const url = `${apiConfig.baseURL}/ads/${adId}`;

    const accessToken = JSON.parse(localStorage.getItem('tokens')).access.token;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error occurred while adding the ad.');
        }

        
        return;
    } catch (error) {
        console.error('Error during ad addition:', error);
        throw error;
    }
};