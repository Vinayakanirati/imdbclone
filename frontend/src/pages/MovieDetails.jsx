import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Star, Trash2 } from 'lucide-react';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // New Review form state
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchMovieAndReviews = async () => {
            try {
                const [movieRes, reviewsRes] = await Promise.all([
                    api.get(`/movies/${id}`),
                    api.get(`/reviews/movie/${id}`)
                ]);
                setMovie(movieRes.data);
                setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 404) {
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMovieAndReviews();
    }, [id, navigate]);

    const handlePostReview = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        
        setSubmitting(true);
        try {
            const { data } = await api.post('/reviews', {
                movieId: movie.id,
                rating: Number(rating),
                content
            });
            // Fetch user info from context locally to immediately show review correctly
            const newReview = { ...data, user: { id: Date.now(), username: user.username } };
            setReviews([newReview, ...reviews]);
            setContent('');
            setRating(5);
        } catch (err) {
            console.error('Failed to post review', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error('Failed to delete review', err);
        }
    };

    if (loading) return <div className="text-center py-20 text-brand-400">Loading movie details...</div>;
    if (!movie) return null;

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1) 
        : 'N/A';

    return (
        <div className="animate-fade-in pb-16">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Movie Details */}
                <div className="lg:w-1/2">
                    <div className="glass-card overflow-hidden">
                        <div className="relative aspect-[16/9] w-full bg-dark-900 border-b border-slate-700/50">
                            {/* Blurry Background */}
                            <img src={movie.poster !== 'N/A' ? movie.poster : ''} className="absolute inset-0 w-full h-full object-cover blur-md opacity-30" alt="" />
                            {/* Sharp foreground poster */}
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <img src={movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450'} alt={movie.title} className="max-h-full rounded shadow-2xl border border-slate-700" />
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                                    <div className="flex items-center space-x-3 text-slate-400 text-sm">
                                        <span className="bg-dark-900 px-3 py-1 rounded-full border border-slate-700">{movie.year}</span>
                                        <span className="uppercase tracking-wider text-brand-400 font-semibold">{movie.type}</span>
                                    </div>
                                </div>
                                <div className="text-center bg-dark-900/80 rounded-xl p-3 border border-slate-700 min-w-[80px]">
                                    <div className="flex items-center justify-center text-yellow-400 mb-1">
                                        <Star fill="currentColor" size={24} />
                                    </div>
                                    <div className="text-white font-bold text-xl">{avgRating}</div>
                                    <div className="text-slate-500 text-xs">{reviews.length} reviews</div>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-white mb-3">Plot Summary</h3>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {movie.plot}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Reviews & Ratings */}
                <div className="lg:w-1/2 space-y-6">
                    {/* Add Review Form */}
                    <div className="glass-card p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Write a Review</h2>
                        {user ? (
                            <form onSubmit={handlePostReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Rating (1-10)</label>
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            type="range" 
                                            min="1" max="10" 
                                            value={rating} 
                                            onChange={(e) => setRating(e.target.value)}
                                            className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                        />
                                        <span className="text-brand-400 font-bold w-8 text-center">{rating}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Thoughts</label>
                                    <textarea 
                                        className="input-glass min-h-[120px] resize-none"
                                        placeholder="What did you think of the movie?"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={submitting} className="btn-primary w-full">
                                    {submitting ? 'Posting...' : 'Post Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-dark-900/50 rounded-xl border border-slate-700/50">
                                <p className="text-slate-400 mb-4">You must be logged in to leave a review.</p>
                                <button onClick={() => navigate('/login')} className="btn-primary">Sign In</button>
                            </div>
                        )}
                    </div>

                    {/* Review List */}
                    <div className="glass-card p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                            <span>Community Reviews</span>
                            <span className="text-sm font-normal text-slate-400 bg-dark-900 px-3 py-1 rounded-full">{reviews.length} total</span>
                        </h2>
                        
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No reviews yet. Be the first!</p>
                            ) : (
                                reviews.map(review => {
                                    const canDelete = user && (user.role === 'ADMIN' || user.username === review.user?.username);
                                    
                                    return (
                                        <div key={review.id} className="p-5 rounded-xl bg-dark-900/50 border border-slate-700/50 hover:border-slate-600 transition group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-400 font-bold border border-slate-700">
                                                        {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{review.user?.username || 'Unknown User'}</p>
                                                        <div className="flex items-center text-yellow-500 text-sm">
                                                            <Star fill="currentColor" size={14} className="mr-1" />
                                                            {review.rating}/10
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {canDelete && (
                                                    <button 
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-slate-300 leading-relaxed text-sm">
                                                {review.content}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
