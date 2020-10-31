'use strict';

let express = require('express');
let cors = require('cors');
let superagent = require('superagent');

let app = express();
require('dotenv').config();
app.use(cors());

const PORT = process.env.PORT;


const client = require('./modules/client.js');
const location = require('./modules/location.js');
const weather = require('./modules/weather.js');
const trail = require('./modules/trails.js');
const movie = require('./modules/movie.js');
const yelp = require('./modules/yelp.js');

app.get('/location', checkLocation);
//app.get('/location', handelLocation);




function checkLocation(req, res) {
    let serchQuery = req.query.city;
    location.checkLoction(serchQuery, res).then(record => {
        res.json(record);

    }).catch(err => {
        res.send(`sorry .. an error occured  ... ${err}`);

    })


}
//const client = require('./moudules/client.js');
app.get('/movies', checkMovie);
function checkMovie(req, res) {
    let serchQuery = req.query.city;
    movie.getMovieFromAPI(serchQuery, res).then(data => {
        res.json(data);

    }).catch(err => {
        res.send(`sorry .. an error occured  ... ${err}`);

    })

}

app.get('/yelp', checkYelp);
function checkYelp(req, res) {
    let serchQuery2 = req.query.city;
    yelp.getYelpFromAPI(res, req, serchQuery2).then(data => {
        res.json(data);

    }).catch(err => {
        res.send(`sorry .. an error occured ... ${err}`);

    })

}


app.get('/weather', handelWeather);

function handelWeather(req, res) {
    let serchQuery2 = req.query.city;
    weather.getWeather(res, serchQuery2).then(data => {
        res.json(data);

    }).catch(err => {
        res.send(`sorry .. an error occured  ... ${err}`);

    })


}


app.get('/trails', handelTrails);

function handelTrails(req, res) {
    let city = req.query.city;
    trail.getTrails(city, req, res).then(data => {
        res.json(data);

    }).catch(err => {
        res.send(`sorry .. an error occured  ... ${err}`);

    })

}





client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`app runing with port ${PORT}`);

    });
}).catch(() => {
    console.log("an error occured");
});

app.get('*', handleWrongPaths);
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
