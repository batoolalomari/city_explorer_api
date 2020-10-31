

let superagent = require('superagent');
const trails={};

trails.getTrails=function(city,req,res)
{
    let lato = req.query.latitude;
    let long = req.query.longitude;
    let key = process.env.TRAIL_API_KEY;
    let trial;
  return  superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${lato}&lon=${long}&maxDistance=200&key=${key}`).
        then((tData) => {
            let object = tData.body.trails;
            trial = object.map((tData) => {
                return new Trails(tData);
            });
          return trial;
        }).catch(() => {
            res.status(500).send("Sorry, something went wrong...");
        })

    };


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

module.exports=trails;

