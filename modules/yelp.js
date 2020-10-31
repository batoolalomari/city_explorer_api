


let superagent = require('superagent');
const client = require('./client.js');
const yelp = {};
let page = 1;


yelp.getYelpFromAPI = function (res,req, serchQuery2) {
    let key = process.env.YELP_API_KEY;
    const numPerPage = 4;
    const start = ((page - 1) * numPerPage + 1);
    page += 1;

    const queryParams = {
        location: req.query.search_query,
        limit: numPerPage,
        offset: start,
    };

    let yelpArr = [];
    return superagent.get(`https://api.yelp.com/v3/businesses/search?location=${serchQuery2}`).query(queryParams).set('Authorization', `Bearer ${key}`).
        then((data) => {
            let object = data.body.businesses;
            movieArr = object.map((yelpsData) => {
                //let yelps = new Yelp(yelpsData.name, yelpsData.image_url, yelpsData.price, yelpsData.rating, yelpsData.url);
                return new Yelp(yelpsData) ;
            });

            return yelpArr;

        }).catch(err => {
            res.send(`sorry .. an error occured while inserting ... ${err}`);

        })
}


function Yelp(yelp) {
    this.name = yelp.name;
    this.image_url = yelp.image_url;
    this.price = yelp.price;
    this.rating = yelp.rating;
    this.url = yelp.url;
}


module.exports = yelp;