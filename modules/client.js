
let pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
let client = new pg.Client(DATABASE_URL);

module.exports=client;