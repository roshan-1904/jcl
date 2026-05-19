import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await eventService.login(credentials);
      if (res.data.success) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#00c6a7] to-[#0f4c75] p-8 text-white text-center">
          <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
            <img src="https://www.jcislmmidtown.com/assets/images/logo-default.png" alt="Logo" className="h-12 w-auto object-contain filter brightness-0 invert" />
          </div>
          <h2 className="text-3xl font-black mb-2">Admin Portal</h2>
          <p className="opacity-80">Please login to access the dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {loginError && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100 animate-shake">
              {loginError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              placeholder="Enter username" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              placeholder="Enter password" 
            />
          </div>
          
          <button type="submit" 
                  className="w-full bg-gradient-to-r from-[#00c6a7] to-[#0f4c75] text-white py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all">
            Login to Dashboard
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
