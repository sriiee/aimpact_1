const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require('dotenv').config();
const DBURL = (process.env.NODE_ENV == 'production') ? process.env.PRODUCTION_DB_PATH : process.env.DEVELOPMENT_DB_PATH;
const DB = mongoose.createConnection(`${DBURL}/aimpact`, { useNewUrlParser:true });
const Schema = mongoose.Schema;

// board
const boardScm = new Schema({
        name: 'string',
        content: 'string',
        seq: 'number',
        utime: 'number'
    },
    {
        versionKey: false,
        collection: 'board',
    });


const boardCon = DB.model('board', boardScm);

module.exports = {
    board: boardCon
};
