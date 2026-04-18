import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function TopicEditContainer() {
    const [topic, setTopic] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();

    const fetchTopic = async () => {
        if (!user) return navigate('/');

        try {
            const res = await api.get(`/topic/${id}`);
            const ress = await api.get('/topic/category/list');
            const dataTopic = res.data.data;
            const dataCategories = ress.data.data;

            if (user.id !== dataTopic.user_id) return navigate('/');

            setTopic(dataTopic);
            setCategories(dataCategories);
            setCategoryId(dataTopic.category_id);
            setTitle(dataTopic.title);
            setContent(dataTopic.content);
        } catch (err) {
            console.error('Gagal mengambil topik untuk di edit:', err);
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/topic/${id}`, { categoryId: Number(categoryId), title, content});
            alert('Topik berhasil di edit!');
            navigate(-1);
        } catch (err) {
            alert(err.response?.data?.message);
            console.error('Gagal mengedit topik:', err);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchTopic();
        } else {
            navigate('/');
        }
    }, [id, user, navigate])

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

            <div className="w-full bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-50 my-auto">
                <form onSubmit={handleEditSubmit} className="flex flex-col space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-terracotta uppercase tracking-widest ml-1 mb-2 block">Judul Topik</label>
                        <input
                            type="text"
                            placeholder="Ada kabar apa hari ini?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-4 bg-creme rounded-2xl border-none focus:ring-2 focus:ring-terracotta/20 focus:outline-none font-bold text-navy placeholder:font-medium transition"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-terracotta uppercase tracking-widest ml-1 mb-2 block">Kategori</label>
                        <div className="relative">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                required
                                className="w-full p-4 bg-creme rounded-2xl border-none focus:ring-2 focus:ring-terracotta/20 focus:outline-none font-bold text-navy appearance-none cursor-pointer transition"
                            >
                                <option value={0} disabled>Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-terracotta uppercase tracking-widest ml-1 mb-2 block">Isi Diskusi</label>
                        <textarea
                            placeholder="Ceritakan detailnya..."
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
    )
}

export default TopicEditContainer;