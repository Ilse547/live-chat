const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const dotenv = require('dotenv');
const GUN = require('gun');
const mongoose = require('mongoose');
const User = require('./models/user.js');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { requireauth } = require('./middleware/authentication');
const bcrypt = require('bcrypt');

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

const JWT_KEY = process.env.JWT_KEY;

app.use(express.json());
//register a new account
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

//login acc     
app.post('/login',async (req, res)=>{
    try{
        const{uname, pword} = req.body;
        const user = await User.findOne({username: uname});

        if(!user) {
            return res.status(401).json({message:'wrong creds'});
        }

        const isValPword = await user.comparePassword(pword);
        if(!isValPword){return res.status(401).json({message:'wrong cred'});}

        req.session.user={
        id:user._id,
        username: user.username,
        authenticated: true
        };

        const payload={
            id:user._id,
            uname: user.username
        };
        const token = jwt.sign(payload, JWT_KEY, {expiresIn: '12h'});
        req.session.token = token;
        res.redirect('/');
    }catch(err){
        console.error('login err:', err);
        res.status(500).json({message:'err during login'});}});

const verifyToken = (req, res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, JWT_KEY, (err, decoded)=>{
            if(err){return res.status(403).json({message:'invalid tokenb'});
        } else{req.user = decoded;
                next();
            }});}else{res.status(403).json ({message:"token not provided"});}}

app.get('/', requireauth, (req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));});

app.get('/api/me', (req, res) => {
    if (req.session.user && req.session.user.authenticated) {
        res.json({
            authenticated: true,
            username: req.session.user.username,
            id: req.session.user.id
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});
    
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destroy error:', err);
        }
        res.redirect('/login.html');
    });
});


server.listen(port, ()=>{
    console.log(`server working: http://localhost:${port}`);
    console.log('gun relay peer run prt', port);
});
