const mongoose = require('mongoose');
const uri='mongodb://rishi:MLosblancos7D@ac-wdmvc7b-shard-00-00.va5zps6.mongodb.net:27017,ac-wdmvc7b-shard-00-01.va5zps6.mongodb.net:27017,ac-wdmvc7b-shard-00-02.va5zps6.mongodb.net:27017/?ssl=true&replicaSet=atlas-fwr7sf-shard-0&authSource=admin&retryWrites=true&w=majority';

//const client=await MongoClient.connect(uri);

mongoose.connect(uri)
.then(()=>{
    console.log("Connection established!");
})
.catch(()=>{
    console.log("DB connection failure");
});



// MongoClient.connect(uri)
// .then((client)=>{
//     console.log("Connection successful to database");
//     module.exports=client;
// })
// .catch((err)=>{
//     console.log(err);
// });

module.exports=mongoose;