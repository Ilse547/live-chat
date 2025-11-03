const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_KEY = process.env.JWT_KEY;

app.use(express.json());

const fakeuser = {
    id: 1,
    uname: 'user1',
    pword: '1234'
};

app.post('/login', (req, res)=>{
    const {uname, pword}= req.body;
    if(uname === fakeuser.uname && pword===fakeuser.pword){
        const payload = { id:fakeuser.id, uname:fakeuser.id};
        const token = jwt.sign(payload,JWT_KEY, {expiresIn: '1d'});
        res.json({token});
    }else{
        res.status(401).json({message:"invalid uname or pword :("});
    };});

const verifyToken = (req, res,next)=>{
    
}
