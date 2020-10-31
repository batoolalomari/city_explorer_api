let superagent = require('superagent');
const client = require('./client.js');
const location={};

location.checkLoction=function(serchQuery,res) {
    
    return getLocationFromDB(serchQuery).then(record=>{
        if (record.rowCount) 
        return record.rows[0];
    
        else{
            getLocationFromAPI(serchQuery,res).then(data => {
            addNewLocationToDB(data);
                return(data);

            }).catch(err => {
                res.send(`sorry .. an error occured while inserting ... ${err}`);
            
            }
                
            );

            
    }

}).catch(err => {
    res.send(`sorry .. an error occured while inserting ... ${err}`);

}
    
);
  
};


function getLocationFromDB(serchQuery){
  let statment = 'SELECT * FROM locations WHERE search_query = $1 ';
  let val = [serchQuery];
  return client.query(statment, val).then((data) => {
    return data;

  });
}

function getLocationFromAPI(serchQuery, res) {
    let key=process.env.GEOCODE_API_KEY;
    return superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${key}&q=${serchQuery}&format=json`).
        then((data) => {
            let object = data.body[0];
            let location = new Location(serchQuery, object.display_name, object.lat, object.lon);

            return location;
        }).catch(err => {
            res.send(`sorry .. an error occured while inserting ... ${err}`);

        })
}

function addNewLocationToDB(data,res) {
    let statement2 = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) ;`;

    let values = [data.search_query, data.formatted_query, data.latitude, data.longitude];


    client.query(statement2, values).then(() => {
        
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

module.exports=location;