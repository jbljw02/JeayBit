import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function useCheckLogin() {

    const checkLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/check_login/`, {}, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    return checkLogin;
}