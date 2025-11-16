const mongoose = require("mongoose");
const Groupschema=new mongoose.Schema({
    Gname:{type:String, time:true, required:true},
    Gid:{type:String,required:true},
    Gparticipants:{type:[String],required:true}
});
module.exports=mongoose.model('Group',Groupschema);
