import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
<<<<<<< HEAD
import { Clock, MessageSquare, ArrowLeft, Send, ChevronLeft, ChevronRight, Trash2, User, FilePen } from "lucide-react";
=======
import { Clock, MessageSquare, ArrowLeft, Send, ChevronLeft, ChevronRight, Trash2, User, FilePen, TriangleAlert } from "lucide-react";
>>>>>>> 02508ef0ae30b7bed70e0be89184af90a5b791ef
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function TopicDetailContainer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [topic, setTopic] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    
    const [commentPagination, setCommentPagination] = useState({ currentPage: 1, totalPages: 1 });
    const commentSectionRef = useRef(null);

    const fetchDetail = async () => {
        try {
            const res = await api.get(`/topic/${id}`);
            setTopic(res.data.data);
            fetchComments(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async (page) => {
        setIsCommentsLoading(true);
        try {
            const res = await api.get(`/comment/topic/${id}?page=${page}`);
            setComments(res.data.data.comments || []);
            setCommentPagination(res.data.data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsCommentsLoading(false);
        }
    };

    const handleDeleteTopic = async () => {
        const msg = user?.role === 'admin' ? "Admin: Hapus topik ini?" : "Yakin ingin menghapus topik ini, Sanak?";
        if (!window.confirm(msg)) return;
        try {
            await api.delete(`/topic/${id}`);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menghapus topik");
        }
    };

    const handleDeleteComment = async (commentId) => {
        const msg = user?.role === 'admin' ? "Admin: Hapus komentar ini?" : "Hapus komentar ini?";
        if (!window.confirm(msg)) return;
        try {
            await api.delete(`/comment/${commentId}/topic/${id}`);
            fetchComments(commentPagination.currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menghapus komentar");
        }
    };

    const handleCommentPageChange = (newPage) => {
        fetchComments(newPage);
        commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/comment/topic/${id}`, { content: newComment });
            setNewComment("");
            fetchComments(1);
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menambahkan komentar');
        }
    };

    const handleGoToProfile = (userId) => {
<<<<<<< HEAD
        if (user.id === topic.user_id) {
=======
        if (user?.id === userId) {
>>>>>>> 02508ef0ae30b7bed70e0be89184af90a5b791ef
            navigate('/profile');
        } else {
            navigate(`/user/${userId}`);
        }
    }

    useEffect(() => {
        fetchDetail();
    }, [id]);

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
        </div>
    );

    const isAdmin = user?.role === 'admin';

    return (
        <main className="flex-1 pt-20 pb-20 px-4 max-w-2xl mx-auto w-full">
<<<<<<< HEAD
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-navy/40 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 hover:text-terracotta transition-colors">
=======
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-navy/40 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 hover:text-terracotta transition-colors hover:cursor-pointer">
>>>>>>> 02508ef0ae30b7bed70e0be89184af90a5b791ef
                <ArrowLeft size={16} /> Kembali
            </button>

            <article className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-creme text-terracotta rounded-xl flex items-center justify-center font-bold">
                            {topic?.username?.[0].toUpperCase()}
                        </div>
                        <div>
                            <div onClick={() => handleGoToProfile(topic.user_id)} className="text-sm font-bold text-navy hover:text-terracotta hover:cursor-pointer transition">@{topic?.username}</div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                                <Clock size={10} />
                                {new Date(topic?.created_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                <span>[
                                {new Date(topic?.created_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}
                                ]</span>
                            </div>
                            {topic?.created_at !== topic?.updated_at && (
                                <div className="flex items-center text-navy font-bold text-[10px]">
                                    *Diedit pada tanggal {new Date(topic?.updated_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })} [{new Date(topic?.updated_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}]
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex">
                        {(user?.id === topic?.user_id) && (
                            <Link to={`/topic/${id}/edit`} className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                                <FilePen size={18} />
                            </Link>
                        )}
                        {(user?.id === topic?.user_id || isAdmin) && (
                            <button onClick={handleDeleteTopic} className={`p-2 transition-colors ${isAdmin && user?.id !== topic?.user_id ? 'text-amber-500 hover:text-red-600' : 'text-gray-300 hover:text-red-500'}`}>
                                <Trash2 size={18} />
                            </button>
                        )}
<<<<<<< HEAD
=======
                        {user && (
                            <Link to={`/topic/${id}/report`} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
                                <TriangleAlert size={18} />
                            </Link>
                        )}
>>>>>>> 02508ef0ae30b7bed70e0be89184af90a5b791ef
                    </div>
                </div>
                <h1 className="text-2xl font-black text-navy mb-4 leading-tight break-words">{topic?.title}</h1>
                <div className="prose prose-sm max-w-none text-navy/80 leading-relaxed whitespace-pre-wrap break-words">{topic?.content}</div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <span className="bg-creme text-[10px] font-black text-terracotta uppercase tracking-widest px-4 py-2 rounded-full">
                        {topic?.category_name || 'Umum'}
                    </span>
                </div>
            </article>

            <section ref={commentSectionRef} className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <MessageSquare size={20} className="text-terracotta" />
                    <h3 className="font-extrabold text-navy">Diskusi</h3>
                </div>

                {user ? (
                    <form onSubmit={handleCommentSubmit} className="mb-8 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ikut berdiskusi..."
                            className="w-full bg-white rounded-2xl p-4 pr-16 shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-terracotta/20 min-h-[100px] text-sm"
                        />
                        <button type="submit" className="absolute bottom-4 right-4 bg-navy text-white p-3 rounded-xl hover:bg-terracotta shadow-md active:scale-90 transition-all">
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate('/login');
                    }}
                        className='w-full mb-8 bg-navy text-white py-4 px-10 rounded-2xl shadow-lg shadow-navy/20 hover:bg-terracotta transition-all font-bold cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50'
                    >
                        Login untuk ikut berdiskusi <User size={18} />
                    </button>
                )}

                <div className="space-y-4">
                    {isCommentsLoading ? (
                        <div className="flex justify-center py-10"><div className="animate-spin h-8 w-8 border-4 border-terracotta border-t-transparent rounded-full"></div></div>
                    ) : comments.length > 0 ? (
                        <>
                            {comments.map((c) => (
                                <div key={c.id} className="bg-white/60 p-5 rounded-2xl border border-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center font-bold text-[10px]">
                                                {c.username?.[0].toUpperCase()}
                                            </div>
                                            <div className='flex flex-col'>
<<<<<<< HEAD
                                                <p className="text-xs font-bold text-navy">@{c.username}</p>
=======
                                                <div onClick={() => handleGoToProfile(c.user_id)} className="text-xs font-bold text-navy hover:text-terracotta hover:cursor-pointer">@{c.username}</div>
>>>>>>> 02508ef0ae30b7bed70e0be89184af90a5b791ef
                                                <div className="flex gap-1 items-center font-bold">
                                                    <Clock size={10} className="text-gray-400" />
                                                    <p className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                                    <p className="text-[10px] text-gray-400">[{new Date(c.created_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}]</p>
                                                </div>
                                                {c.created_at !== c.updated_at && (
                                                    <div className='text-[10px] text-navy flex font-bold'>
                                                        *Diedit pada tanggal {new Date(c.updated_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })} [{new Date(c.updated_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}]
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {(user?.id === c.user_id) && (
                                                <Link to={`/topic/${id}/comment/${c.id}`} className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                                                    <FilePen size={14} />
                                                </Link>
                                            )}
                                            {(user?.id === c.user_id || isAdmin) && (
                                                <button onClick={() => handleDeleteComment(c.id)} className={`transition-colors ${isAdmin && user?.id !== c.user_id ? 'text-amber-500 hover:text-red-600' : 'text-gray-300 hover:text-red-500'}`}>
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
<<<<<<< HEAD
=======
                                            {user && (
                                                <Link to={`/topic/${id}/comment/${c.id}/report`} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
                                                    <TriangleAlert size={14} />
                                                </Link>
                                            )}
>>>>>>> 02508ef0ae30b7bed70e0be89184af90a5b791ef
                                        </div>
                                    </div>
                                    <p className="text-sm text-navy/70 leading-relaxed break-words">{c.content}</p>
                                </div>
                            ))}

                            {commentPagination.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button 
                                        disabled={commentPagination.currentPage === 1}
                                        onClick={() => handleCommentPageChange(commentPagination.currentPage - 1)}
                                        className="p-2 bg-white rounded-lg border border-gray-100 disabled:opacity-30"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    
                                    <div className="flex gap-1">
                                        {[...Array(commentPagination.totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handleCommentPageChange(i + 1)}
                                                className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${commentPagination.currentPage === i + 1 ? 'bg-navy text-white' : 'bg-white text-navy border border-gray-50'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        disabled={commentPagination.currentPage === commentPagination.totalPages}
                                        onClick={() => handleCommentPageChange(commentPagination.currentPage + 1)}
                                        className="p-2 bg-white rounded-lg border border-gray-100 disabled:opacity-30"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-400 text-sm italic py-10">Belum ada diskusi di sini.</p>
                    )}
                </div>
            </section>
        </main>
    );
}

export default TopicDetailContainer;