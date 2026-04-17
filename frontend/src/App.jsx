import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, Heart, User, CircleAlert } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import MyNavLink from './components/MyNavLink';
import TopicsContainer from './pages/Topics';
import LoginContainer from './pages/Login';
import ProfileContainer from './pages/Profile';
import RegisterContainer from './pages/Register';
import TopicCreateContainer from './pages/TopicCreate';
import TopicDetailContainer from './pages/TopicDetail';
import RulesContainer from './pages/Rules';
import TopicEditContainer from './pages/TopicEdit';
import CommentEditContainer from './pages/CommentEdit';
import UserProfileContainer from './pages/UserProfile';
import AdminDashboardContainer from './pages/AdminDashboard';
import TopicReportContainer from './pages/TopicReport';
import CommentReportContainer from './pages/CommentReport';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-creme">
      <header className="fixed top-0 w-full h-16 bg-white border-b border-gray-100 flex items-center justify-start px-6 z-50">
        <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
          <img 
            src="/urangkita.png" 
            alt="Urangkita Logo" 
            className="h-15 w-auto object-contain"
          />
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-black tracking-tighter text-navy leading-tight text-center">
              URANG<span className="text-terracotta">KITA</span>
            </h1>
            <span className="text-[7px] font-black text-gray-400 tracking-[0.3em] uppercase leading-none text-center">
              Ranah & Rantau
            </span>
          </div>
        </div>
      </header>

      <Routes>
        <Route path='/' element={<TopicsContainer />} />
        <Route path='/login' element={<LoginContainer />} />
        <Route path='/profile' element={<ProfileContainer />} />
        <Route path='/user/:uId' element={<UserProfileContainer />} />
        <Route path='/register' element={<RegisterContainer />} />
        <Route path='/create-topic' element={<TopicCreateContainer />} />
        <Route path='/topic/:id' element={<TopicDetailContainer />} />
        <Route path='/topic/:id/edit' element={<TopicEditContainer />} />
        <Route path='/topic/:id/comment/:cId' element={<CommentEditContainer />} />
        <Route path='/rules' element={<RulesContainer />} />
        <Route path='/Admin' element={<AdminDashboardContainer />} />
        <Route path='/topic/:id/report' element={<TopicReportContainer />} />
        <Route path='/topic/:tid/comment/:cid/report' element={<CommentReportContainer />} />
      </Routes>

      <nav className="fixed bottom-0 w-full h-16 bg-white border-t border-gray-100 flex justify-around items-center px-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <MyNavLink to='/' icon={Home} label='Home' />
        <MyNavLink to='/rules' icon={CircleAlert} label='Aturan' />
        <MyNavLink to='/create-topic' icon={PlusSquare} label='Posting' />
        <MyNavLink to='/notification' icon={Heart} label='Notif' />
        <MyNavLink to={user ? '/profile' : '/login'} icon={User} label={user ? 'Profil' : 'Masuk'} />
      </nav>
    </div>
  );
}

export default App;