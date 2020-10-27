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

app.get('/location', handelLocation);
app.get('/location', checkLocation);

function handleWrongPaths(req, res) {
    res.status(404).send('page not found');
}

function checkLocation() {
    let serchQuery = req.query.search_query;
    let statement = `SELECT * FROM locations WHERE search_query=${serchQuery} RETURNING *;`;

    let city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;

    let lato = req.query.latitude;
    let long = req.query.longitude;
    let formated = req.query.formatted_query;

    client.query(statement, values).then(record => {
        if (record.rowCount > 0)
            res.send(record.rows);
        else {
            superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`).
                then((data) => {
                    let object = data.body[0];
                    let location = new Location(city, object.display_name, object.lat, object.lon);
                    let statement2 = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *;`;

                    let values = [city, formated, lato, long];
                    client.query(statement2, values).then(insertedRecord => {
                        res.send(insertedRecord.rows);
                        res.status(200).json(location);
                    }).catch(err => {
                        res.send(`sorry .. an error occured while inserting ... ${err}`);
                    });

                }).catch(err => {
                    res.send(`sorry .. an error occured while inserting ... ${err}`);

                }).catch(err => {
                    res.send(`sorry .. an error occured while inserting ... ${err}`);//first then

                
                });
            }
            });//then
                
        }

function handelLocation(req, res) {
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
                                //console.log(data);*/

                            }).catch(() => {
                                res.status(500).send("Sorry, something went wrong...");
                            });

                        /*let object=jsonData[0];
                        let location=new Location(city,object.display_name,object.lat,object.lon);
                    
                        res.status(200).json(location);*/
                        //}
                        /*catch(message){
                        res.status(500).send("Sorry, something went wrong..."); 
                    }*/
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

                /*
                
              {
                "name": "Rattlesnake Ledge",
                "location": "Riverbend, Washington",
                "length": "4.3",
                "stars": "4.4",
                "star_votes": "84",
                "summary": "An extremely popular out-and-back hike to the viewpoint on Rattlesnake Ledge.",
                "trail_url": "https://www.hikingproject.com/trail/7021679/rattlesnake-ledge",
                "conditions": "Dry: The trail is clearly marked and well maintained.",
                "condition_date": "2018-07-21",
                "condition_time": "0:00:00 "
              },
                 */
            }

            client.connect().then(() => {
                app.listen(PORT, () => {
                    console.log(`app runing with port ${PORT}`);

                });
            }).catch(() => {
                console.log("an error occured");
            });
       




