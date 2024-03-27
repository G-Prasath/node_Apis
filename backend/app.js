require('dotenv').config()
const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes/authRoutes.js');


const app = express();
app.use(express.json());


try {
    connectDB.connect()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('listening on port ' + process.env.PORT);

            /** Router Page */
            app.use('/api', router)

              
        });
    }).catch((error) => {
        console.log("Error connecting to database: ", error);
    });
} catch (error) {
    console.log('Error connecting to database: ', error);
}
