let express= require('express');
let cors=require('cors');
let app=express();
require('dotenv').config();
app.use(cors());

const PORT=process.env.PORT;

app.get('/location',handelLocation);

function handelLocation(req,res)
{
    let city=req.query.city;
    let jsonData=require('./data/location.json');
    let object=jsonData[0];
    let location=new Location(city,object.display_name,object.lat,object.lon);

    res.status(200).json(location);
}

function Location(search_query,formatted_query,latitude,longitude)
{
    this.search_query=search_query;
    this.formatted_query=formatted_query;
    this.latitude=latitude;
    this.longitude=longitude;
}

app.listen(PORT,()=>{
    console.log(`app runing with port ${PORT}`);

});

