import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function TopicReportContainer() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [reason, setReason] = useState('');

    const fetchTopic = async () => {
        try {
            const response = await api.get(`/topic/${id}`);
            setTopic(response.data.data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleReport = async () => {
        try {
            await api.post(`/report/topic/${id}`, { reason });
            alert('Berhasil melaporkan topik');
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Gagal melaporkan topik');
        }
    }

    useEffect(() => {
        if (user) {
            fetchTopic();
        } else {
            navigate('/');
        }
    }, [user, id, navigate]);

    return (
        <main className="flex-1 py-20 px-4 max-w-2xl mx-auto w-full">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-navy/40 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 hover:text-terracotta hover:cursor-pointer transition-colors">
                <ArrowLeft size={16} /> Kembali
            </button>

            <div className="flex gap-2 items-center justify-center mb-6">
                <h1 className="font-black text-3xl text-navy">Laporkan Topik</h1>
            </div>

             <article className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 mb-3">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-creme text-terracotta rounded-xl flex items-center justify-center font-bold">
                            {topic?.username?.[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-navy">@{topic?.username}</div>
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
                </div>
                <h1 className="text-2xl font-black text-navy mb-4 leading-tight break-words">{topic?.title}</h1>
                <div className="prose prose-sm max-w-none text-navy/80 leading-relaxed whitespace-pre-wrap break-words">{topic?.content}</div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <span className="bg-creme text-[10px] font-black text-terracotta uppercase tracking-widest px-4 py-2 rounded-full">
                        {topic?.category_name || 'Umum'}
                    </span>
                </div>
            </article>

            <div className='bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50'>
                <label htmlFor="reason" className="block text-sm font-bold text-terracotta mb-2">Alasan Melaporkan</label>
                <textarea id="reason" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    rows={4} 
                    className="w-full p-4 bg-creme rounded-2xl border-none focus:ring-2 focus:ring-terracotta/20 focus:outline-none font-medium text-navy transition resize-none mb-4"
                    placeholder="Jelaskan alasan kamu melaporkan topik ini..."
                ></textarea>
                <button onClick={handleReport} className="w-full py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition shadow-lg shadow-navy/20 bg-navy hover:bg-terracotta hover:shadow-terracotta/20 hover:cursor-pointer">Laporkan</button>
            </div>
        </main>
    );
}

export default TopicReportContainer;