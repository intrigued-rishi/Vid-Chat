const mongoose=require('mongoose');

const farmerSchema=new mongoose.Schema({
    name:{
        type:String
    },
    location:{
        type:Object
    }
});

const farmer=mongoose.model('farmer',farmerSchema);
module.exports=farmer;