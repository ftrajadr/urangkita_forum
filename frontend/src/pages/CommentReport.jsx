import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function CommentReportContainer() {
    const { user } = useAuth();
    const { tid, cid } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState(null);
    const [reason, setReason] = useState('');

    const fetchComment = async () => {
        try {
            const res = await api.get(`/comment/${cid}/topic/${tid}`);
            setComment(res.data.data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleReport = async () => {
        try {
            await api.post(`/report/comment/${cid}/topic/${tid}`, { reason });
            alert('Berhasil melaporkan komen');
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Gagal melaporkan komen');
        }
    }

    useEffect(() => {
        if (!user) return navigate('/');
        fetchComment();
    }, [user, tid, cid, navigate]);

    if (!comment) return (
        <main className="flex-1 py-20 px-4 max-w-2xl mx-auto w-full">
            <p className="text-center text-navy/50">Memuat komentar...</p>
        </main>
    );

    return (
        <main className="flex-1 py-20 px-4 max-w-2xl mx-auto w-full">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-navy/40 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 hover:text-terracotta hover:cursor-pointer transition-colors">
                <ArrowLeft size={16} /> Kembali
            </button>

            <div className="flex gap-2 items-center justify-center mb-6">
                <h1 className="font-black text-3xl text-navy">Laporkan Komen</h1>
            </div>

            <div className="bg-white/60 p-5 rounded-2xl border border-gray-50 mb-6">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center font-bold text-[10px]">
                            {comment.username?.[0].toUpperCase()}
                        </div>
                        <div className='flex flex-col'>
                            <p className="text-xs font-bold text-navy">@{comment.username}</p>
                            <div className="flex gap-1 items-center font-bold">
                                <Clock size={10} className="text-gray-400" />
                                <p className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                <p className="text-[10px] text-gray-400">[{new Date(comment.created_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}]</p>
                            </div>
                            {comment.created_at !== comment.updated_at && (
                                <div className='text-[10px] text-navy flex font-bold'>
                                    *Diedit pada tanggal {new Date(comment.updated_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })} [{new Date(comment.updated_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}]
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-sm text-navy/70 leading-relaxed break-words">{comment.content}</p>
            </div>

            <div className='bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50'>
                <label htmlFor="reason" className="block text-sm font-bold text-terracotta mb-2">Alasan Melaporkan</label>
                <textarea id="reason" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    rows={4} 
                    className="w-full p-4 bg-creme rounded-2xl border-none focus:ring-2 focus:ring-terracotta/20 focus:outline-none font-medium text-navy transition resize-none mb-4"
                    placeholder="Jelaskan alasan kamu melaporkan komentar ini..."
                ></textarea>
                <button onClick={handleReport} className="w-full py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition shadow-lg shadow-navy/20 bg-navy hover:bg-terracotta hover:shadow-terracotta/20 hover:cursor-pointer">Laporkan</button>
            </div>
        </main>
    );
}

export default CommentReportContainer;