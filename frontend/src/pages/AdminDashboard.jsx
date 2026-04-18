import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
    ShieldAlert, User, MessageSquare, LayoutGrid, 
    AlertTriangle, Calendar, ChevronRight, Hash, 
    Pencil
} from "lucide-react";

function AdminDashboardContainer() {
    const [section, setSection] = useState(1);
    const [reportedUser, setReportedUser] = useState([]);
    const [reportedTopic, setReportedTopic] = useState([]);
    const [reportedComment, setReportedComment] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    const sectionList = [
        { id: 1, name: 'User', icon: <User size={14} /> },
        { id: 2, name: 'Topik', icon: <LayoutGrid size={14} /> },
        { id: 3, name: 'Komen', icon: <MessageSquare size={14} /> }
    ];

    const fetchData = async () => {
        try {
            const [resUser, resTopic, resComment] = await Promise.all([
                api.get('/report/user'),
                api.get('/report/topic'),
                api.get('/report/comment')
            ]);

            setReportedUser(resUser.data.data);
            setReportedTopic(resTopic.data.data);
            setReportedComment(resComment.data.data);
        } catch (err) {
            console.error("Gagal ambil data laporan:", err);
        }
    }

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            return navigate('/');
        }
        fetchData();
    }, [user, navigate]);

    const ignoreReportUser = async (id) => {
        if (!window.confirm('Abaikan laporan ini?')) return;
        try {
            await api.delete(`/report/user/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal mengabaikan laporan ini');
        }
    }

    const ignoreReportTopic = async (id) => {
        if (!window.confirm('Abaikan laporan ini?')) return;
        try {
            await api.delete(`/report/topic/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal mengabaikan laporan ini');
        }
    }

    const ignoreReportComment = async (id) => {
        if (!window.confirm('Abaikan laporan ini?')) return;
        try {
            await api.delete(`/report/comment/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal mengabaikan laporan ini');
        }
    }

    const ReportCard = ({ title, subTitle, content, reason, date, reporter, link, handleIgnore, badge }) => (
        <div className='group bg-creme/50 p-6 rounded-[2rem] border border-creme hover:border-terracotta/30 transition-all duration-300'>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-navy/40">
                        {badge}
                    </div>
                    <div>
                        <h1 className='text-sm font-black text-navy leading-tight'>{title}</h1>
                        <p className='text-[10px] font-bold text-terracotta uppercase tracking-wider'>{subTitle}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {content && (
                    <div className='bg-white/80 p-4 rounded-2xl border border-gray-50'>
                        <div className='flex items-center gap-2 mb-1'>
                            <Pencil size={14} className='text-terracotta' />
                            <p className='text-[10px] font-black text-navy/40 uppercase tracking-widest'>Isi</p>
                        </div>
                        <p className='text-sm font-medium text-navy/80 leading-relaxed line-clamp-5 break-words'>{content}</p>
                    </div>
                )}

                <div className="bg-white/80 p-4 rounded-2xl border border-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className="text-terracotta" />
                        <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Alasan</p>
                    </div>
                    <p className="text-sm font-medium text-navy/80 italic leading-relaxed break-words">"{reason}"</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-navy/20"></div>
                        <p className="text-[11px] font-bold text-navy/60">
                            Oleh: <span className="text-navy font-black">@{reporter}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} />
                        <p className="text-[11px] font-bold">
                            {new Date(date).toLocaleDateString('id', { day: '2-digit', month: 'short', year: 'numeric'})}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-dashed border-gray-200 flex flex-wrap justify-end gap-1">
                <button onClick={handleIgnore} className='bg-navy text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-terracotta transition-colors shadow-lg shadow-navy/10'>
                    Abaikan
                </button>
                <Link to={link} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-terracotta transition-colors shadow-lg shadow-navy/10">
                    Lihat Detail <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );

    return (
        <main className='flex-1 max-w-2xl mx-auto w-full py-20 px-4'>
            <div className="flex items-center justify-center gap-3 mb-6 px-2">
                <ShieldAlert size={24} className="text-terracotta" />
                <div>
                    <h1 className="text-xl font-black text-navy tracking-tight">Admin Dashboard</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Moderasi Konten & User</p>
                </div>
            </div>

            <div className='flex flex-wrap gap-2 mb-8 items-center justify-center'>
                {sectionList.map((s) => (
                    <button key={s.id}
                        onClick={() => setSection(s.id)}
                        className={`${section === s.id 
                            ? 'bg-terracotta text-white border-terracotta shadow-lg shadow-terracotta/20' 
                            : 'bg-white text-navy/60 border-gray-100 hover:border-terracotta/30 shadow-sm'} 
                            flex items-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-wider rounded-2xl border cursor-pointer duration-300 transition`}
                    >
                        {s.icon} {s.name}
                    </button>
                ))}
            </div>

            <div className='bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 min-h-[400px]'>
                <div className="flex flex-col gap-4">
                    
                    {/* SECTION 1: REPORTED USER */}
                    {section === 1 && (
                        reportedUser.length > 0 ? (
                            reportedUser.map((ru) => (
                                <ReportCard 
                                    key={ru.id}
                                    title={`@${ru.reported_name}`}
                                    subTitle="User Terlapor"
                                    reason={ru.reason}
                                    reporter={ru.reporter_name}
                                    date={ru.created_at}
                                    badge={<User size={20} />}
                                    handleIgnore={() => ignoreReportUser(ru.id)}
                                    link={`/user/${ru.reported_id}`}
                                />
                            ))
                        ) : <EmptyState />
                    )}

                    {/* SECTION 2: REPORTED TOPIC */}
                    {section === 2 && (
                        reportedTopic.length > 0 ? (
                            reportedTopic.map((rt) => (
                                <ReportCard 
                                    key={rt.id}
                                    title={rt.topic_title}
                                    subTitle="Topik Terlapor"
                                    reason={rt.reason}
                                    reporter={rt.reporter_name}
                                    date={rt.created_at}
                                    badge={<LayoutGrid size={20} />}
                                    handleIgnore={() => ignoreReportTopic(rt.id)}
                                    link={`/topic/${rt.topic_id}`}
                                />
                            ))
                        ) : <EmptyState />
                    )}

                    {/* SECTION 3: REPORTED COMMENT */}
                    {section === 3 && (
                        reportedComment.length > 0 ? (
                            reportedComment.map((rc) => (
                                <ReportCard 
                                    key={rc.id}
                                    title={`Komen oleh @${rc.comment_author}`}
                                    subTitle="Komentar Terlapor"
                                    content={rc.comment_content}
                                    reason={rc.reason}
                                    reporter={rc.reporter_name}
                                    date={rc.created_at}
                                    badge={<MessageSquare size={20} />}
                                    handleIgnore={() => ignoreReportComment(rc.id)}
                                    link={`/topic/${rc.topic_id}`}
                                />
                            ))
                        ) : <EmptyState />
                    )}

                </div>
            </div>
        </main>
    );
}

const EmptyState = () => (
    <div className="py-30 text-center">
        <div className="w-16 h-16 bg-creme rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
            <ShieldAlert size={24} className="text-gray-300" />
        </div>
        <p className="text-navy/30 font-bold text-sm uppercase tracking-widest">Tidak ada laporan</p>
    </div>
);

export default AdminDashboardContainer;