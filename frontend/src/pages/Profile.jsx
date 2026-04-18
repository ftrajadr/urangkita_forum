import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MessageSquare, Clock, ChevronRight, LayoutGrid } from "lucide-react";
import api from '../api/api';

function ProfileContainer() {
    const [topics, setTopics] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchTopics = async () => {
        try {
            const res = await api.get(`/topic/user/${user?.id}`);
            setTopics(res.data.data);
        } catch (err) {
            console.error("Gagal ambil topic user:", err);
        }
    }

    useEffect(() => {
        if (!user) return navigate('/');
        fetchTopics();
    }, [user, navigate]);

    if (!user) return null;

    const joinedAtDate = new Date(user.created_at).toLocaleDateString('id', { day: '2-digit', month: 'long', year: 'numeric' });

    const handleLogoutClick = async () => {
        try {
            if (window.confirm('Yakin ingin keluar, Sanak?')) {
                await logout();
                navigate('/');
            }
        } catch (err) {
            console.error('Gagal keluar:', err);
        }
    }

    window.scrollTo({ top: 0, behavior: 'instant'});

    return (
        <main className='flex-1 max-w-2xl mx-auto w-full pt-20 px-4 pb-20'>
            <div className='bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 mb-6'>
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 bg-creme text-terracotta rounded-[2rem] flex items-center justify-center font-bold text-4xl mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
                        {user.username?.[0].toUpperCase()}
                    </div>
                    <h1 className='text-2xl font-black text-navy tracking-tight'>@{user.username}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="bg-navy text-[9px] font-black text-white uppercase tracking-[0.15em] px-3 py-1 rounded-full shadow-sm">
                            {user.role}
                        </span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            #{user.id}
                        </span>
                    </div>
                </div>
                
                <div className="bg-creme/50 p-4 rounded-2xl border border-creme mb-8 flex items-center justify-center gap-2">
                    <Clock size={14} className="text-navy/30" />
                    <p className="text-xs font-bold text-navy/60">
                        Bergabung pada <span className="text-terracotta">{joinedAtDate}</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link to="/profile/edit" className="flex items-center justify-center bg-navy text-white py-4 rounded-2xl font-bold hover:bg-terracotta transition shadow-lg shadow-navy/10 text-sm">
                        Edit Profil
                    </Link>
                    <button onClick={handleLogoutClick} className="flex items-center justify-center py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition border border-red-50 text-sm cursor-pointer">
                        Keluar Akun
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={18} className="text-terracotta" />
                        <h2 className="font-black text-navy uppercase text-[11px] tracking-[0.2em]">Topik Saya</h2>
                    </div>
                    <span className="bg-creme px-2 py-1 rounded-lg text-[10px] font-black text-navy/40">
                        Total: (<span className="text-navy">{topics.length}</span>)
                    </span>
                </div>

                {topics.length > 0 ? (
                    topics.map((t) => (
                        <Link 
                            key={t.id} 
                            to={`/topic/${t.id}`}
                            className="group block bg-white p-5 rounded-[1.5rem] border border-gray-50 shadow-sm hover:border-terracotta/20 transition-all active:scale-[0.98]"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <span className="inline-block bg-creme text-[9px] font-black text-terracotta uppercase tracking-widest px-2 py-1 rounded-md mb-2">
                                        {t.category_name}
                                    </span>
                                    <h3 className="text-sm font-bold text-navy leading-snug group-hover:text-terracotta transition-colors line-clamp-3 break-words">
                                        {t.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                            <Clock size={12} />
                                            {new Date(t.created_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            <span>
                                                [{new Date(t.created_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}]
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold truncate">
                                            <MessageSquare size={12} />
                                            <span>
                                                Diskusi (<span className="text-navy">{t.total_comments}</span>)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl text-gray-300 group-hover:text-terracotta group-hover:bg-creme transition-all shrink-0">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="bg-white/50 border-2 border-dashed border-gray-100 rounded-[2rem] p-12 text-center">
                        <p className="text-navy/30 font-bold text-sm mb-4">Belum ada topik yang dibuat.</p>
                        <Link to="/create-topic" className="text-xs font-black text-terracotta uppercase tracking-widest hover:underline">
                            Buat Topik Pertama Sanak!
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

export default ProfileContainer;