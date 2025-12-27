import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 5000,
    withCredentials: true
});

export const checkAuth = async () => {
    try {
        const req = await api.get('/api/v1/auth/check', {
            withCredentials: true
        });
        return req.data;
    } catch (error) {
        console.log(error);
    }
}

export const visitorCount = async () => {
    try {
        const req = await api.get('/api/v1/visitor/increment', {
            withCredentials: true
        });
        return req.data;
    } catch (error) {
        console.log(error);
    }
}

export const userLogin = async (payload) => {
    try {
        const req = await api.post('/api/v1/auth/login', payload, {
            withCredentials: true,
        });
        return req.data;
    } catch (error) {
        console.log(error);
        // ✅ Return a consistent structure even on error
        return error?.response?.data || { success: false, message: "Network error" };
    }
};

export const registerUser = async (payload) => {
    try {
        const req = await api.post('/api/v1/auth/register', payload, {
            withCredentials: true
        });
        return req.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data || { success: false, message: "Network error" };
    }
}

export const getUser = async () => {
    try {
        const req = await api.get('/api/v1/auth/', {
            withCredentials: true
        });
        return req.data.data;
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (payload) => {
    try {
        const req = await api.put('/api/v1/auth/', payload, {
            withCredentials: true
        });
        return req.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data || { success: false, message: "Network error" };
    }
}

export const logoutUser = async () => {
    try {
        const req = await api.post('/api/v1/auth/logout', {}, {
            withCredentials: true
        });
        return req.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data || { success: false, message: "Network error" };
    }
}

export const deleteUser = async () => {
    try {
        const req = await api.delete('/api/v1/auth/', {
            withCredentials: true
        });
        return req.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data || { success: false, message: "Network error" };
    }
}