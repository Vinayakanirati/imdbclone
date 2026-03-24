import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Film, UserCircle, LogOut, ShieldAlert } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-brand-400 hover:text-brand-300 transition">
                <Film size={28} />
                <span className="text-2xl font-bold tracking-wider">FlixBase</span>
            </Link>
            
            <div className="flex items-center space-x-6">
                {user ? (
                    <>
                        <div className="flex items-center space-x-2 text-slate-300">
                            <UserCircle size={20} />
                            <span className="font-medium">{user.username}</span>
                            {user.role === 'ADMIN' && (
                                <span className="bg-brand-500/20 text-brand-400 text-xs px-2 py-1 rounded-full font-bold ml-2">ADMIN</span>
                            )}
                        </div>
                        {user.role === 'ADMIN' && (
                            <Link to="/admin" className="text-slate-300 hover:text-brand-400 flex items-center space-x-1 transition">
                                <ShieldAlert size={18} />
                                <span>Dashboard</span>
                            </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-300 hover:text-white transition font-medium">Login</Link>
                        <Link to="/register" className="btn-primary py-2 px-4 shadow-none">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
