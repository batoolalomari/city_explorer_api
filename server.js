let express= require('express');
let cors=require('cors');
let app=express();
let superagent=require('superagent');
require('dotenv').config();
app.use(cors());

const PORT=process.env.PORT;

app.get('/location',handelLocation);

function handelLocation(req,res)
{
    try{
    let city=req.query.city;
    //let jsonData=require('./data/location.json');
    let key='pk.74aeb760be786d944c09a41102505213';
   superagent.get(`GET https://eu1.locationiq.com/v1/search.php?key=${key}q=${city}&format=json`).then((data)=>{

    res.send(data);

    });
    /*let object=jsonData[0];
    let location=new Location(city,object.display_name,object.lat,object.lon);

    res.status(200).json(location);*/
    }
    catch(message){
    res.status(500).send("Sorry, something went wrong..."); 
}
}

function Location(search_query,formatted_query,latitude,longitude)
{
    this.search_query=search_query;
    this.formatted_query=formatted_query;
    this.latitude=latitude;
    this.longitude=longitude;
}

app.get('/weather',handelWeather);

function handelWeather(req,res)
{
    try{
    let jsonData=require('./data/weather.json');
   // let object=jsonData.data;
   let object=jsonData.map((mapData)=>{

    return mapData.data;

   });
    let data=[];

    for (let index = 0; index < object.length; index++) {
         data=new Weather(object[index].description,object[index].timedate);

    }

    res.status(200).json(data);
    }
    catch(message){
        res.status(500).send("Sorry, something went wrong..."); 
    }
}

function Weather(forecast,timedate)
{
    this.forecast=forecast;
    this.timedate= new Date(timedate).toDateString() ;
    
}

app.listen(PORT,()=>{
    console.log(`app runing with port ${PORT}`);

});

