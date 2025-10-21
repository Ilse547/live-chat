const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const dotenv = require('dotenv');
const GUN = require('gun');
const mongoose = require('mongoose');
const User = require('./models/user.js');
const { userInfo } = require('os');

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

const server = require('http').createServer(app);


const gun = GUN({
    web: server,
    peers: [
        'https://gun-manhattan.herokuapp.com/gun',
        'https://gun-us.herokuapp.com/gun'
    ]
});

app.post('/register', async (req, res)=>{
    try {
        const{username, password, phone} = req.body;
        
        if(!username || !password) {
            return res.status(400).json({
                error: 'Username and password are required'
            });
        }
        if(password.length < 6){
            return res.status(400).json({
                error:'Password must be min. 6 char'
            });
        }
        const Existinguser = await User.findOne({username});
        if(Existinguser) {
            return res.status(400).json ({
                error:'User already exists'
            });
        }
        const newUser = new User({
            username,
            password,
            uuid: Date.now().toString(),
            phone
        });
        await newUser.save();
        res.redirect("/")
    } catch(error){
        console.error('registration error:', error);
        res.status(500).json({error:'error while registratin'});
    }
});



server.listen(port, ()=>{
    console.log(`server working: http://localhost:${port}`);
    console.log('gun relay peer run prt', port);
});
