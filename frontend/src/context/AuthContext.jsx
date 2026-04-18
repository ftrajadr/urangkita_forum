import { createContext, useState, useEffect, useContext } from "react";
import api from '../api/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const res = await api.get('/auth/me');
            const data = res.data.data.user;
            setUser(data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (err) {
            console.error('Gagal logout', err);
            setUser(null);
        }
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="animate-pulse text-terracotta font-bold">Sedang memuat Urangkita...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, fetchUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);