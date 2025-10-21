const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Userschema = new mongoose.Schema({
    username: {type:String, unique:true, required:true},
    uuid: {type:String, unique:true, required:true},
    phone: {type:String, unique:true},
    password: {type:String, required:true}
});
Userschema.pre('save', async function(next) {
    if(!this.isModified('password')) return next;
    try{
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch(error) {
        next(error);
    }
});
Userschema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', Userschema);