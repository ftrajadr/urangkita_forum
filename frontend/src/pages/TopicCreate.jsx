import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ChevronDown, ArrowLeft } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function TopicCreateContainer() {
    const [categoryId, setCategoryId] = useState(0); 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return navigate('/login');
        const fetchCategories = async () => {
            try {
                const res = await api.get('/topic/category/list');
                setCategories(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, [user, navigate]);

    if (!user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryId || !title.trim() || !content.trim()) return alert('Harap diisi semua!');
        setIsSubmitting(true);
        try {
            await api.post('/topic', { categoryId: Number(categoryId), title, content });
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal posting');
        } finally {
            setIsSubmitting(false);
        }
    };

    window.scrollTo({ top: 0, behavior: 'instant'});

    return (
        <main className="flex-1 min-h-screen flex flex-col items-center px-4 pt-20 pb-20 max-w-2xl mx-auto w-full">
            <div className="w-full bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-50 my-auto">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
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
                        {isSubmitting ? 'Menerbitkan...' : 'Terbitkan Sekarang'}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default TopicCreateContainer;