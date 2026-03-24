import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Failed to register account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-16 animate-fade-in">
            <div className="glass-card w-full max-w-md p-8 md:p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Join FlixBase</h1>
                    <p className="text-slate-400">Create an account to track your favorites.</p>
                </div>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input 
                            type="text" 
                            className="input-glass"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="input-glass"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input 
                            type="password" 
                            className="input-glass"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full mt-4"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
