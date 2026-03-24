import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setLoading(true);
        setError('');
        setSearchResults([]);
        setSuccessMessage('');

        try {
            const { data } = await api.get(`/omdb/search?s=${query}`);
            if (data.Search) {
                setSearchResults(data.Search);
            } else {
                setError(data.Error || 'No movies found.');
            }
        } catch (err) {
            setError('Failed to fetch from OMDB.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveMovie = async (omdbMovie) => {
        setSuccessMessage('');
        setError('');
        try {
            // First we need to fetch the full details by OMDB ID to get the plot before saving
            // Wait, our backend might only need imdbId, title, year, type, poster!
            // According to task, we modeled Movie with those fields, so we can save it directly.
            // Oh wait, our Movie entity has a 'plot' field. Let's fetch it via OMDB API first!
            const detailsRes = await api.get(`/omdb/movie?i=${omdbMovie.imdbID}`);
            const fullMovie = detailsRes.data;

            const moviePayload = {
                imdbId: fullMovie.imdbID,
                title: fullMovie.Title,
                year: fullMovie.Year,
                type: fullMovie.Type,
                poster: fullMovie.Poster,
                plot: fullMovie.Plot !== 'N/A' ? fullMovie.Plot : 'No plot available.'
            };

            await api.post('/movies', moviePayload);
            setSuccessMessage(`Successfully added "${fullMovie.Title}" to the local database!`);
        } catch (err) {
            console.error(err);
            setError('Failed to save movie to database.');
        }
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-10 border-b border-slate-700/50 pb-6">
                <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">Search the OMDB database and import movies to our local index.</p>
            </div>

            <div className="glass-card p-6 md:p-10 mb-10">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            className="input-glass pl-12"
                            placeholder="Enter movie title (e.g. Inception, Dhurandhar)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
                        {loading ? 'Searching...' : 'Search OMDB'}
                    </button>
                </form>

                {error && <div className="mt-6 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/30">{error}</div>}
                {successMessage && <div className="mt-6 text-brand-400 bg-brand-500/10 p-4 rounded-lg border border-brand-500/30 font-medium">{successMessage}</div>}
            </div>

            {searchResults.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {searchResults.map((movie) => (
                            <div key={movie.imdbID} className="glass-card overflow-hidden flex flex-col group">
                                <div className="aspect-[2/3] overflow-hidden relative">
                                    <img 
                                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} 
                                        alt={movie.Title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{movie.Title}</h3>
                                    <p className="text-slate-400 text-sm mb-4">{movie.Year} • {movie.Type}</p>
                                    
                                    <button 
                                        onClick={() => handleSaveMovie(movie)}
                                        className="btn-secondary w-full mt-auto flex items-center justify-center space-x-2 border border-slate-600 hover:border-brand-500 hover:text-brand-400 group-hover:bg-brand-500/10"
                                    >
                                        <Plus size={18} />
                                        <span>Add to DB</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
