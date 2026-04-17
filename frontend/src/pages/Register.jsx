import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function RegisterContainer() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return navigate('/');
    }, [user, navigate]);

    if (user) return null;

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return alert('Password tidak sama!');
        
        setIsLoading(true);
        try {
            await api.post('/auth/register', { username, email, password });
            alert('Daftar berhasil! Silahkan login...');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Registrasi Gagal');
        } finally {
            setIsLoading(false);
        }
    }

    window.scrollTo({ top: 0, behavior: 'instant'});

    return (
        <main className="flex-1 min-h-screen flex flex-col items-center px-4 max-w-2xl mx-auto w-full pt-20 pb-20">
            <div className="w-full my-auto text-center">
                <div className="mb-5">
                    <h1 className="text-4xl font-black text-navy mb-2 tracking-tight">Urangkita.</h1>
                    <p className="text-navy/50 font-bold text-xs uppercase tracking-[0.2em]">Buat Akun Baru</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-navy/5 border border-gray-100 max-w-md mx-auto">
                    <form className='flex flex-col space-y-4' onSubmit={handleRegisterSubmit}>
                        <div className="relative">
                            <input
                                placeholder="Username"
                                type="text"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className='bg-creme p-4 pl-12 w-full rounded-2xl border border-transparent focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition font-medium'
                            />
                            <User className="absolute left-4 top-4 text-navy/20" size={18} />
                        </div>

                        <div className="relative">
                            <input
                                placeholder="Email"
                                type="email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className='bg-creme p-4 pl-12 w-full rounded-2xl border border-transparent focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition font-medium'
                            />
                            <Mail className="absolute left-4 top-4 text-navy/20" size={18} />
                        </div>

                        <div className="relative">
                            <input
                                placeholder="Password"
                                type="password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className='bg-creme p-4 pl-12 w-full rounded-2xl border border-transparent focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition font-medium'
                            />
                            <Lock className="absolute left-4 top-4 text-navy/20" size={18} />
                        </div>

                        <div className="relative">
                            <input
                                placeholder="Konfirmasi Password"
                                type="password"
                                value={confirmPassword}
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className='bg-creme p-4 pl-12 w-full rounded-2xl border border-transparent focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition font-medium'
                            />
                            <Lock className="absolute left-4 top-4 text-navy/20" size={18} />
                        </div>

                        <NavLink to='/login' className='text-terracotta text-sm font-bold hover:text-navy transition py-2'>
                            Sudah punya akun? <span className='underline underline-offset-4'>Masuk disini!</span>
                        </NavLink>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className='bg-navy text-white py-4 px-10 rounded-2xl shadow-lg shadow-navy/20 hover:bg-terracotta transition-all font-bold cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50'
                        >
                            {isLoading ? "Mendaftarkan..." : (
                                <>
                                    Daftar Sekarang <UserPlus size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default RegisterContainer;