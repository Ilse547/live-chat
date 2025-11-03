const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const dotenv = require('dotenv');
const GUN = require('gun');
const mongoose = require('mongoose');
const User = require('./models/user.js');
const session = require('express-session');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() =>{
        console.log("connected to mongo atlas");
    })
    .catch((error) => {
        console.error("mongodb atlas connection error:", error);
        process.exit(1);
    });

const app = express();
const port = process.env.PORT;

app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret:'randomsecret-chat',
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false} //change before delplying to true
}));

const server = require('http').createServer(app);


const gun = GUN({
    web: server,
    peers: [
        'https://gun-manhattan.herokuapp.com/gun',
        'https://gun-us.herokuapp.com/gun'
    ]
});




server.listen(port, ()=>{
    console.log(`server working: http://localhost:${port}`);
    console.log('gun relay peer run prt', port);
});
