const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require('dotenv').config();
const DBURL = (process.env.NODE_ENV == 'production') ? process.env.PRODUCTION_DB_PATH : process.env.DEVELOPMENT_DB_PATH;
const DB = mongoose.createConnection(`${DBURL}/aimpact`, { useNewUrlParser:true });
const Schema = mongoose.Schema;

// user
const userScm = new Schema({
        name: 'string',
        email: 'string',
        password: 'string',
        ctime: 'number'
    },
    {
        versionKey: false,
        collection: 'user',
    });


const userCon = DB.model('user', userScm);

module.exports = {
    user: userCon
};
