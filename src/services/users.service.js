import apiConfig from '../configs/api.config';

export const saveUsersAdRunTime = async (adData, userId = null) => {

    const url = `${apiConfig.baseURL}/users/${userId}/saveAdsRunTime`;

    const accessToken = JSON.parse(localStorage.getItem('tokens')).access.token;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(adData)
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
