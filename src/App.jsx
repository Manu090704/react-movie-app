import React, { useEffect ,useState } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search';
import Spinner from './components/spinner';
import MovieCard from './components/movieCard';
import { updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`
    }
};

const App = () => {
    // you can only change the value of a state variable
    // using the function that is returned by useState
    // in this case setSearchTerm
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useDebounce(() => setDebouncedSearchTerm(searchTerm),500,[searchTerm]);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');
        try{
            const endpoint = query ?
            `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            // Here you would typically set the movies in state
            if(data.response == 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies. Please try again later.');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);
            updateSearchCount();

        }catch(error) {
            console.error('Error fetching movies:', error);
            setErrorMessage('Failed to fetch movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }  
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return ( 
        <main>
            <div className='pattern'/>

            <div className='wrapper'>
            <header>
                <img src="./hero.png" alt="hero banner  " />
                <h1>Find <span className='text-gradient'>movies </span> you'll enjoy without the hassle</h1>
                <Search searchTerm ={searchTerm} setSearchTerm ={setSearchTerm} />
            </header>

            <section className='all-movies'>
                <h2 className='mt-[40px]'>All Movies</h2>

                {isLoading ? (
                    <Spinner />
                ) : errorMessage ? (
                    <p className='text-red-500'>{errorMessage}</p>
                ) : (
                    <ul>
                        {movieList.map((movie)=> (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </ul>
                )
            }
                {/* Here you would map through the movies and display them */}
            </section>

            </div>
        </main>
     );
}
 
export default App;