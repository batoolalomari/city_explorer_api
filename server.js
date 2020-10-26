let express= require('express');
let cors=require('cors');
let app=express();
//let superagent=require('superagent');
require('dotenv').config();
app.use(cors());

const PORT=process.env.PORT;

app.get('/location',handelLocation);

function handelLocation(req,res)
{
    try{
    let city=req.query.city;
    let jsonData=require('./data/location.json');
   /*superagent.get('url api from the documentation and passed the token int he key and search city',(data)=>{

    console.log(data);

    });*/
    let object=jsonData[0];
    let location=new Location(city,object.display_name,object.lat,object.lon);

    res.status(200).json(location);
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

    for (let index = 0; index < jsonData.length; index++) {
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

