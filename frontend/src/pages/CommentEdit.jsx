import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function CommentEditContainer() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();
    const { id, cId } = useParams();
    const navigate = useNavigate();

    const fetchComment = async () => {
        if (!user) return navigate('/');
        setIsLoading(true);
        try {
            const res = await api.get(`/comment/${cId}/topic/${id}`);
            const dataComment = res.data.data;
            if (user.id !== dataComment.user_id) return navigate('/');
            setContent(dataComment.content);
        } catch (err) {
            console.error('Gagal saat mengambil komen:', err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/comment/${cId}/topic/${id}`, { content });
            alert('Komen berhasil di edit!');
            navigate(-1);
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchComment();
        } else {
            return navigate('/');
        }
    }, [user, id, cId, navigate]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
            <Loader2 className="animate-spin text-terracotta mb-4" size={40} />
            <p className="text-navy/40 font-bold text-[10px] uppercase tracking-[0.2em]">Loading...</p>
        </div>
    );

    return (
        <main className="flex-1 min-h-screen flex flex-col items-center px-4 pt-20 pb-20 max-w-2xl mx-auto w-full">
            <div className="w-full flex justify-start mb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-navy/40 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-terracotta transition-colors"
                >
                    <ArrowLeft size={16} /> Kembali
                </button>
            </div>
            <div className="w-full bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-50">
                <form onSubmit={handleEditSubmit} className="flex flex-col space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-terracotta uppercase tracking-widest ml-1 mb-2 block">Edit Komen</label>
                        <textarea
                            rows="6"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 bg-creme rounded-2xl border-none focus:ring-2 focus:ring-terracotta/20 focus:outline-none font-medium text-navy transition resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition shadow-lg
                            ${isSubmitting ? 'bg-gray-200' : 'bg-navy hover:bg-terracotta shadow-terracotta/20 cursor-pointer'}`}
                    >
                        <Send size={18} />
                        {isSubmitting ? 'Memproses...' : 'Konfirmasi Edit'}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default CommentEditContainer;