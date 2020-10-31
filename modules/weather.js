

let superagent = require('superagent');
const weather={};


weather.getWeather=function(res,serchQuery2){
    let key=process.env.WEATHER_API_KEY
    let dataArr;
       return superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${serchQuery2}&key=${key}`).
            then((Wdata) => {
                let object = Wdata.body.data;
                dataArr = object.map((wdata) => {
                    return new Weather(wdata.weather.description, wdata.datetime);
                });
                return dataArr;
            }).catch(() => {
                res.status(500).send("Sorry, something went wrong...");
            })
}

function Weather(forecast,time) {
    this.forecast = forecast;
    this.time = new Date(time).toDateString();

}

module.exports=weather;

