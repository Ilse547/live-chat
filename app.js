const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const dotenv = require('dotenv');
const GUN = require('gun');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = 3000;

app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));


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
