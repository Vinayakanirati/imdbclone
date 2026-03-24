import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Play, Star } from 'lucide-react';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data } = await api.get('/movies');
                // Mix random logic or just slice if we want "random 50-60 movies"
                setMovies(data.sort(() => 0.5 - Math.random()).slice(0, 60));
            } catch (err) {
                console.error("Error fetching movies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) return <div className="text-center py-20 text-brand-400">Loading amazing movies...</div>;

    return (
        <div className="animate-fade-in pb-16">
            <div className="mb-12 mt-8 text-center px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white gap-2 justify-center">
                    Explore the <span className="text-gradient">Cinema Universe</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Discover, review, and save details of your favorite movies ranging from blockbuster hits to mysterious indie gems.
                </p>
            </div>

            {movies.length === 0 ? (
                <div className="text-center text-slate-500 py-10 bg-dark-800/30 rounded-2xl border border-slate-700/30 max-w-3xl mx-auto">
                    <p className="text-xl">No movies available yet. Admins are adding movies soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {movies.map(movie => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="group relative block animate-slide-up">
                            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-dark-800 shadow-xl border border-slate-700/50 relative">
                                <img 
                                    src={movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{movie.title}</h3>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="bg-brand-500/80 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">{movie.year}</span>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-500/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 backdrop-blur-sm">
                                    <Play fill="white" size={24} className="text-white ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
