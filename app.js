const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const dotenv = require('dotenv');
const GUN = require('gun');
const mongoose = require('mongoose');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const { requireauth } = require('./middleware/authentication');
const bcrypt = require('bcrypt');
const user = require('./models/user.js');

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
const JWT_KEY = process.env.JWT_KEY;
app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const server = require('http').createServer(app);


const gun = GUN({
    web: server,
    peers: [
        'https://lich-z34n.onrender.com/gun',
        'https://gun-manhattan.herokuapp.com/gun',
        'https://gun-us.herokuapp.com/gun'
    ]
});



app.use(express.json());
app.post('/register',async (req, res)=>{
    try {
        const {uname, pword}=req.body;
        const existuser = await User.findOne({username:uname});
        if(existuser){return res.status(400).json({message:'user already exists'});}


        const newUser = new User({
            username: uname,
            password: pword
        });
        await newUser.save();
        console.log("user created")
        res.redirect('/login.html');
    }catch(err){console.error('problem while reg:', err); res.status(401).json({message:"could not create user"});}
})
   
app.post('/login',async (req, res)=>{
    try{
        const{uname, pword} = req.body;
        const user = await User.findOne({username: uname});

        if(!user) {
            return res.status(401).json({message:'wrong creds'});
        }

        const isValPword = await user.comparePassword(pword);
        if(!isValPword){return res.status(401).json({message:'wrong creds'});}
        const payload={
            id:user._id,
            uname: user.username,
            admin: user.admim||false
        };
        const token = jwt.sign(payload, JWT_KEY, {expiresIn: '12h'});
        res.json({token, username: user.username, id: user._id, admin:user.admin||false});
    }catch(err){
        console.error('login err:', err);
        res.status(500).json({message:'err during login'});}});

const verifyToken = (req, res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, JWT_KEY, (err, decoded)=>{
            if(err){return res.status(403).json({message:'invalid token'});
        } else{req.user = decoded;
                next();
            }});}else{res.status(403).json ({message:"token not provided"});}}

app.get('/', requireauth, (req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));});
app.get('/api/me',verifyToken,async (req, res) => {
        try{
            const user = await User.findById(req.user.id)
            res.json({
            authenticated: true,
            username:user.username,
            id:user._id,
            admin:user.admin||false
        });

    }catch(err){
        console.error('error getting user:',err);
        res.json({authenticated:false});
    }
});
server.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
    console.log('gun relay peer run prt', port);
});
