import React, { useState, useEffect } from 'react'
import axios from './axios';
import "./Row.css";
import movieTrailer from 'movie-trailer';
import YouTube from 'react-youtube';
const API_KEY = "b918717b55881fd7b7f0f47b0485e927";


const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            let movies = []
            for (let i = 0; i < 20; i++) {
                const id = request.data.results[i].id;
                const Movie = await axios.get(`http://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`)
                const withTrailer = Movie.data.videos.results[0]?.key
                if(withTrailer) {
                    movies.push(request.data.results[i])
                }
            }
            setMovies(movies);
            return request;
        }   
        fetchData();
    }, [fetchUrl])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        }
    }

    const handleClick = (movie) => {
        if(trailerUrl) {
            setTrailerUrl('')
        } else {
            movieTrailer(movie?.name || "")
                .then( async (url) => {                    
                    const urlParams = await  axios.get(`http://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=videos`);
                    setTrailerUrl(urlParams.data.videos.results[0].key);
                })
                .catch((error) => console.log(error));
        } 
    }   

  return (
    <div>
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {movies.map(movie => (
                    <img
                        onClick={() => handleClick(movie)}
                        key={movie.id}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name} 
                    />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} /> }
        </div>
    </div>
  )
}

export default Row