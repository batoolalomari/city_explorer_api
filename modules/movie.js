

let superagent = require('superagent');
const client = require('./client.js');
const movie={};



movie.getMovieFromAPI=function(serchQuery2, res) {
    let key=process.env.MOVIE_API_KEY;
     let movieArr=[];
    return superagent.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${serchQuery2}&include_adult=false`).
        then((data) => {
            let object = data.body.results;
            movieArr = object.map((movieData) => {         
               /* movies = new Movie(movieData.title,movieData.overview,movieData.vote_average,movieData.vote_count,movieData.poster_path,movieData.popularity,movieData.release_date);*/

                return new Movie(movieData) ;
            });

           return movieArr;
        }).catch(err => {
            res.send(`sorry .. an error occured while inserting ... ${err}`);

        })

}

function Movie(movie) {


    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;

}


module.exports=movie;