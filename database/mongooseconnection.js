const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const mongooseConnection = () => { 
    mongoose.connect(process.env.Mongo_uri).then((data) => {  // Please Put your own Mongo UR
        console.log(`Mongo connection ${data.connection.host}`);
    }).catch((error) => { 
        console.log(error);
    });
}

module.exports = mongooseConnection;