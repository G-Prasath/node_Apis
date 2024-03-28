require('dotenv').config()
const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes/authRoutes.js');
const session = require('express-session');


const app = express();
app.use(express.json());
app.use(session({
    secret: 'some of your secret',
    resave: false,
    cookie: { maxAge: 30000 },
    saveUninitialized: false
}))


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

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
