const express=require("express");
const path=require('path')

let server=express();

server.listen(8080,(err)=>{
    if(err)
        console.log("Error in setting up server");
});

server.get('/index',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})
