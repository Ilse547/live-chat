const mongoose = require("mongoose");
const Groupschema = new mongoose.Schema({
    Gname:{type:String, trim:true, required:true},
    Gid:{required:true},
    Gparticipants:{required}
});

module.exports = mongoose.model('Group', Groupschema);