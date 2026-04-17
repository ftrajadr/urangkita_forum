import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, MessageSquare, Rss, Wallet, Globe, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/api";

function TopicsContainer() {
    const [topics, setTopics] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const isFirstRun = useRef(true);
    const navigate = useNavigate();

    const mainCategories = [
        { id: 1, name: 'Lapiak Maota', icon: Rss },
        { id: 2, name: 'Lapiak Jua/Bali', icon: Wallet },
        { id: 3, name: 'Lapiak Promosi', icon: Globe }
    ];

    const fetchTopics = async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (activeCategory !== 0) params.append('category_id', activeCategory);
            params.append('page', page);

            const res = await api.get(`/topic?${params.toString()}`);
            setTopics(res.data.data.topics);
            setPagination(res.data.data.pagination);

            const savedScroll = sessionStorage.getItem('last_scroll_pos');
            if (savedScroll && isFirstRun.current) {
                setTimeout(() => {
                    window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
                    sessionStorage.removeItem('last_scroll_pos');
                    sessionStorage.removeItem('last_topic_page');
                }, 100);
            } else {
                window.scrollTo({ top: 0, behavior: 'instant' })
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            if (isFirstRun.current) isFirstRun.current = false;
        }
    }

    const handleGoToDetail = (topicId) => {
        sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
        sessionStorage.setItem('last_topic_page', pagination.currentPage.toString());
        navigate(`/topic/${topicId}`);
    };

    useEffect(() => {
        const savedPage = sessionStorage.getItem('last_topic_page');
        const pageToFetch = (isFirstRun.current && savedPage) ? parseInt(savedPage) : 1;

        if (isFirstRun.current) {
            fetchTopics(pageToFetch);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchTopics(1);
        }, search ? 500 : 0);

        return () => clearTimeout(delayDebounceFn);
    }, [search, activeCategory]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchTopics(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <main className="flex-1 pt-20 pb-20 px-4 max-w-2xl mx-auto w-full">
            <div className="mb-6">
                <div className="relative">
                    <input 
                        type="text"
                        value={search} 
                        placeholder="Cari topik..." 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="bg-white p-4 pl-12 rounded-2xl shadow-sm border border-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-terracotta/20 w-full transition" 
                    />
                    <Search className="absolute left-4 top-5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setActiveCategory(0)}
                    className={`px-5 py-3 rounded-2xl font-bold text-xs transition-all duration-300 cursor-pointer border
                        ${activeCategory === 0 ? 'bg-navy text-white border-navy shadow-lg shadow-navy/20' : 'bg-white text-navy/60 border-gray-100 hover:border-terracotta/30 shadow-sm'}`}
                >
                    Semua
                </button>
                {mainCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(activeCategory === cat.id ? 0 : cat.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all duration-300 cursor-pointer border
                            ${activeCategory === cat.id ? 'bg-terracotta text-white border-terracotta shadow-lg shadow-terracotta/20' : 'bg-white text-navy/60 border-gray-100 hover:border-terracotta/30 shadow-sm'}`}
                    >
                        <cat.icon size={14} />
                        {cat.name}
                    </button>
                ))}
            </div>
            
            <div className="space-y-4 min-h-[300px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                        <Loader2 className="animate-spin text-terracotta mb-4" size={40} />
                        <p className="text-navy/40 font-bold text-[10px] uppercase tracking-[0.2em]">Mencari topik...</p>
                    </div>
                ) : topics.length > 0 ? (
                    <>
                        {topics.map((t) => (
                            <div 
                                key={t.id} 
                                onClick={() => handleGoToDetail(t.id)}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:border-terracotta/30 transition-all duration-300 cursor-pointer group active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-creme text-terracotta rounded-2xl flex-shrink-0 flex justify-center items-center font-bold text-lg border border-gray-100 group-hover:bg-terracotta group-hover:text-white transition-colors duration-300">
                                        {t.username?.[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="font-extrabold text-navy text-lg leading-tight mb-1 group-hover:text-terracotta transition-colors line-clamp-3 break-words">{t.title}</h2>
                                        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                            <p className="text-xs font-bold text-terracotta-dark lowercase">@{t.username}</p>
                                            <div className="flex items-center gap-1">
                                                <Clock size={10} />
                                                <span>{new Date(t.created_at).toLocaleDateString('id', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                            </div>
                                            <span>[{new Date(t.created_at).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}]</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-navy/70 text-sm leading-relaxed line-clamp-3 break-words mb-4 px-1">{t.content}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="bg-creme text-[10px] font-black text-navy/40 uppercase tracking-widest px-3 py-1 rounded-full">{t.category_name || 'Umum'}</span>
                                    <div className="flex items-center gap-1 text-terracotta font-bold text-xs">
                                        <MessageSquare size={14} />
                                        <span>Diskusi (<span className="text-navy">{t.total_comments}</span>)</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button 
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="p-3 rounded-xl bg-white border border-gray-100 text-navy disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <div className="flex gap-1">
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-bold text-sm hover:border-terracotta/30 transition-all cursor-pointer ${pagination.currentPage === i + 1 ? 'bg-navy text-white shadow-lg' : 'bg-white text-navy border border-gray-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="p-3 rounded-xl bg-white border border-gray-100 text-navy disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic">Topik tidak ditemukan...</p>
                    </div>
                )}
            </div>

            <div className="mt-12">
                <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-3xl p-8 text-center group transition-all hover:bg-amber-50 hover:border-amber-300">
                    <p className="text-amber-600/60 text-[10px] font-black uppercase tracking-[0.2em]">Ruang Iklan</p>
                </div>
            </div>
        </main>
    );
}

export default TopicsContainer;