// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import "./OmdbMovies.css";
// import Loader from '../Loader/Loader'
// import NoPoster from "../../assets/defaultPoster.jpg";
// function OmdbMovies() {
//   let [movies, setmovies] = useState([]);
//   let [search, setsearch] = useState("");
//   let [searchedMovie, setsearchedMovie] = useState("avengers");
//   let [loading, setloading] = useState(false);
//   let [error, seterror] = useState(false);

//   let updateUsers = async () => {
//     setloading(true);
//     try {
//       let {
//         data: { Search },
//       } = await axios.get(
//         `https://www.omdbapi.com/?s=${searchedMovie}&apikey=d3e95da8`
//       );

//       setmovies(Search);
//       setloading(false);
//     } catch (err) {
//       console.log(err);
//       seterror(true);
//       setloading(false);
//     }
//   };

//   let updateSearch = ({ target: { value } }) => {
//     setsearch(value);
//   };

//   useEffect(() => {
//     updateUsers();
//   }, [searchedMovie]);

//   console.log(movies);

//   let searchMovie = () => {
//     setmovies([]);
//     setsearchedMovie(search);
//   };

//   return (
//     <section className="omdb">
//       <div className="search">
//         <input type="search" placeholder="Movie Name" onChange={updateSearch} />
//         <button onClick={searchMovie}>Search</button>
//       </div>
//       {loading && <Loader />}
//       {error && <h1 style={{ color: "Red", fontSize: "40px" }}>API Error</h1>}

//       <div className="movie-list">
//         {movies ? (
//           movies?.map((movie) => {
//             return (
//               <div key={movie.imdbID} className="movie">
//                 <img
//                   src={movie.Poster !== "N/A" ? movie.Poster : NoPoster}
//                   alt="No Image"
//                 />
//               </div>
//             );
//           })
//         ) : (
//           <h1 style={{ color: "white" }}>No Movie Found</h1>
//         )}
//       </div>
//     </section>
//   );
// }

// export default OmdbMovies;


import axios from "axios";
import React, { useEffect, useState } from "react";
import "./OmdbMovies.css";
import Loader from "../Loader/Loader";
import NoPoster from "../../assets/defaultPoster.jpg";

function OmdbMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedMovie, setSearchedMovie] = useState("avengers");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1); // To track the current page

  // Debounce Timeout
  let debounceTimeout;

  const updateUsers = async () => {
    setLoading(true); // Show loader
    setError(false); // Reset error state
    setMovies([]); // Clear previous movies

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchedMovie}&page=${page}&apikey=d3e95da8`
      );

      if (response.data.Search) {
        setMovies(response.data.Search); // Movies found
      } else {
        setError(true); // No movies found
      }
    } catch (err) {
      setError(true); // API error
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const updateSearch = ({ target: { value } }) => {
    setSearch(value);
    clearTimeout(debounceTimeout); // Clear the previous timeout

    debounceTimeout = setTimeout(() => {
      if (value.trim() === "") {
        setSearchedMovie("avengers"); // Reset to default movies
      } else {
        setSearchedMovie(value); // Search for the entered value
      }
    }, 500); // 500ms debounce delay
  };

  useEffect(() => {
    updateUsers();
  }, [searchedMovie, page]); // Fetch data when searchedMovie or page changes

  const handleNext = () => {
    setPage(page + 1); // Go to the next page
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1); // Go to the previous page (but not below 1)
    }
  };

  return (
    <section className="omdb">
      <div className="search">
        <input
          type="search"
          placeholder="Movie Name"
          value={search}
          onChange={updateSearch}
        />
      </div>
      {loading && <Loader />} {/* Show loader when loading */}
      {!loading && error && (
        <h1 style={{ color: "Red", fontSize: "40px" }}>No Movie Found</h1>
      )}
      {/* Show error if no movies or API error */}
      {!loading && !error && (
        <>
          <div className="movie-list">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie">
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : NoPoster}
                  alt="No Image"
                />
              </div>
            ))}
          </div>

          <div className="pagenation">
            {page > 1 && (
              <button onClick={handlePrevious} className="prev-btn">
                Previous
              </button>
            )}

            {movies.length > 0 && (
              <button onClick={handleNext} className="next-btn">
                Next
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default OmdbMovies;
