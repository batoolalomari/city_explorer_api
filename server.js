let express = require('express');
let cors = require('cors');
let superagent = require('superagent');
let pg = require('pg');

let app = express();
require('dotenv').config();
app.use(cors());

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
let client = new pg.Client(DATABASE_URL);

app.get('/location', checkLocation);
//app.get('/location', handelLocation);




function checkLocation(req, res) {
    let serchQuery = req.query.city;
    // let statement = `SELECT * FROM locations WHERE search_query=$1 ;`;

    getLocationFromDB(serchQuery).then(record => {

        if (record.rowCount > 0) {
            res.json(record.rows[0]);
        }
        else {
            getLocationFromAPI(serchQuery, res).then(data => {
                addNewLocationToDB(location);
                res.json(data);

            });

        }

    });


}

app.get('/movies', checkMovie);
function checkMovie(req, res) {
    let serchQuery = req.query.city;

    getMovieFromDB(serchQuery).then(record => {

        if (record.rowCount > 0) {
            res.json(record.rows[0]);
        }
        else {
            getMovieFromAPI(serchQuery, res).then(data => {
                addNewMovieToDB(movie);
                res.json(data);

            });

        }

    });


}

app.get('/yelp', checkYelp);
function checkYelp(req, res) {
    let serchQuery = req.query.data.id;
    let serchQuery2 = req.query.data.search_query;

    getYelpFromDB(serchQuery).then(record => {

        if (record.rowCount > 0) {
            res.json(record.rows[0]);
        }
        else {
            getYelpFromAPI(res,serchQuery2).then(data => {
                addNewYelpToDB(yelp);
                res.json(data);

            });

        }

    });


}



function getLocationFromDB(serchQuery) {
    let statement = `SELECT * FROM locations WHERE search_query=$1 ;`;
    let sQ = [serchQuery];

    return client.query(statement, sQ).then(record => {

        // console.log(record.rowCount);
        return record;
        // res.send(record.rows);
    }).catch(err => {
        res.send(`sorry .. an error occured while inserting ... ${err}`);//first then


    });

}

function getLocationFromAPI(serchQuery, res) {
    let key=process.env.GEOCODE_API_KEY;
    return superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${key}&q=${serchQuery}&format=json`).
        then((data) => {
            let object = data.body[0];
            let location = new Location(serchQuery, object.display_name, object.lat, object.lon);

        }).catch(err => {
            res.send(`sorry .. an error occured while inserting ... ${err}`);

        })
}

function addNewLocationToDB(location) {
    let statement2 = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) ;`;

    let values = [location.search_query, location.formatted_query, location.latitude, location.longitude];


    client.query(statement2, values).then(() => {
        //res.send(insertedRecord.rows[0]);
        // res.status(200).json(location);
        return location;
    }).catch(err => {
        res.send(`sorry .. an error occured while inserting ... ${err}`);
    });

}




function getMovieFromDB(serchQuery) {
    let statement = `SELECT * FROM movies WHERE search_query=$1 ;`;
    let sQ = [serchQuery];

    //let key = process.env.GEOCODE_API_KEY;
    return client.query(statement, sQ).then(record => {

        return record;
      
    }).catch(err => {
        res.send(`sorry .. an error occured while inserting ... ${err}`);//first then


    });


}

function getMovieFromAPI(serchQuery, res) {
    let key=process.env.MOVIE_API_KEY;

    return superagent.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${serchQuery}`).
        then((data) => {
            let object = data.body[0];
            let movie = new Movie(object.title,object.overview,object.vote_average,object.vote_count,object.poster_path,object.popularity,object.release_date);


        }).catch(err => {
            res.send(`sorry .. an error occured while inserting ... ${err}`);

        })

}

function addNewMovieToDB(movie) {
    let statement2 = `INSERT INTO movies (title, overview, vote_average, vote_count,poster_path,popularity,release_date) VALUES ($1, $2, $3, $4,$5,$6,$7) ;`;

    let values = [movie.title,movie.overview,movie.vote_average,movie.vote_count,movie.poster_path,movie.popularity,movie.release_date];


    client.query(statement2, values).then(() => {
        //res.send(insertedRecord.rows[0]);
        // res.status(200).json(location);
        return movie;
    }).catch(err => {
        res.send(`sorry .. an error occured while inserting ... ${err}`);
    });

}

function getYelpFromDB(serchQuery) {
    let statement = `SELECT * FROM yelps WHERE location_id=$1 ;`;
    let sQ = [serchQuery];

    return client.query(statement, sQ).then(record => {

        // console.log(record.rowCount);
        return record;
        // res.send(record.rows);
    }).catch(err => {
        res.send(`sorry .. an error occured while inserting ... ${err}`);//first then


    });

}

function getYelpFromAPI( res,serchQuery2) {
    let key=process.env.YELP_API_KEY;
    return superagent.get(`https://api.yelp.com/v3/businesses/search?location=${serchQuery2}`).set('Authorization', `Bearer ${key}`).
        then((data) => {
            let object = data.body.businesses;
            let yelp = new Yelp(object.name, object.image_url, object.price, object.rating,object.url);
        }).catch(err => {
            res.send(`sorry .. an error occured while inserting ... ${err}`);

        })
}

function addNewYelpToDB(yelp) {
    let statement2 = `INSERT INTO yelps (name, image_url, price, rating,url) VALUES ($1, $2, $3, $4,$5) ;`;

    let values = [yelp.name, yelp.image_url, yelp.price, yelp.rating,yelp.url];


    client.query(statement2, values).then(() => {
        //res.send(insertedRecord.rows[0]);
        // res.status(200).json(location);
        return yelp;
    }).catch(err => {
        res.send(`sorry .. an error occured while inserting ... ${err}`);
    });

}


function Location(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}

app.get('/weather', handelWeather);

function handelWeather(req, res) {
    // try{
    let city = req.query.search_query;
    //let jsonData=require('./data/weather.json');
    // let object=jsonData.data;
    let key = process.env.WEATHER_API_KEY;
    let data = [];
    superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`).
        then((Wdata) => {
            let object = Wdata.body.data;
            data = object.map((Wdata) => {
                console.log(Wdata);
                return new Weather(Wdata.weather.description, Wdata.datetime);
            });

            res.status(200).json(data);
        }).catch(() => {
            res.status(500).send("Sorry, something went wrong...");
        })

    /* 
 
     for (let index = 0; index < object.length; index++) {
          data=new Weather(object[index].description,object[index].timedate);
 
     }
 
     res.status(200).json(data);
     }
     catch(message){
         res.status(500).send("Sorry, something went wrong..."); 
     }*/
}

function Weather(forecast, time) {
    this.forecast = forecast;
    this.time = new Date(time).toDateString();

}




app.get('/trails', handelTrails);

function handelTrails(req, res) {
    // try{
    //
    let city = req.query.city;
    let key = process.env.TRAIL_API_KEY;
    let lato = req.query.latitude;
    let long = req.query.longitude;
    let trial;
    superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${lato}&lon=${long}&maxDistance=200&key=${key}`).
        then((tData) => {
            let object = tData.body.trails;
            trial = object.map((tData) => {
                return new Trails(tData);
            });
            res.status(200).json(trial);
        }).catch(() => {
            res.status(500).send("Sorry, something went wrong...");
        })

}

function Trails(tObject) {
    this.name = tObject.name;
    this.location = tObject.location;
    this.length = tObject.length;
    this.stars = tObject.stars;
    this.star_votes = tObject.starVotes;
    this.summary = tObject.summary;
    this.trail_url = tObject.url;
    this.conditions = tObject.conditionStatus;
    this.condition_date = tObject.conditionDate.slice(0, 10);
    this.condition_time = tObject.conditionDate.slice(11, 19);

}

function Movie(movie) {


    title = movie.title;
    overview = movie.overview;
    average_votes = movie.vote_average;
    total_votes = movie.vote_count;
    image_url = `https://image.tmdb.org/t/p${movie.poster_path}`;
    popularity = movie.popularity;
    released_on = movie.release_date;

}

function Yelp(yelp) {
    this.name = yelp.name;
    this.image_url = yelp.image_url;
    this.price = yelp.price;
    this.rating = yelp.rating;
    this.url = yelp.url;
  }

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`app runing with port ${PORT}`);

    });
}).catch(() => {
    console.log("an error occured");
});


function handleWrongPaths(req, res) {
    res.status(404).send('page not found');
}



//lab0&8
/**function handelLocation(req, res) {
    //try{
    let city = req.query.city;
    //let jsonData=require('./data/location.json');
    let key = process.env.GEOCODE_API_KEY;
    superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`).
        then((data) => {
            let object = data.body[0];
            let location = new Location(city, object.display_name, object.lat, object.lon);

            res.status(200).json(location);

            //}
            /*catch(message){
            res.status(500).send("Sorry, something went wrong..."); 
            res.status(200).json(data);
            //console.log(data);

        }).catch(() => {
            res.status(500).send("Sorry, something went wrong...");
        });*/

/*let object=jsonData[0];
let location=new Location(city,object.display_name,object.lat,object.lon);
 
res.status(200).json(location);*/
//}
/*catch(message){
res.status(500).send("Sorry, something went wrong..."); 
}
}*/


/*app.get('/location', addMovie);

function addMovie(req, res) {
    let serchQuery = req.query.city;
    let statement = `SELECT * FROM locations WHERE search_query=$1 ;`;
    let sQ = [serchQuery];
    let key = process.env.MOVIE_API_KEY;
    client.query(statement, sQ).then(record => {


    }).catch(() => {
        res.send(`sorry .. an error occured while inserting ... ${err}`);

    });
    superagent.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${search_query}`).
        then((data) => {
            let object = data.body.trails;
            movie = object.map((data) => {
                return new Movie(data);
            });

        }).catch(err => {
            res.send(`sorry .. an error occured while inserting ... ${err}`);
        });



}*/
