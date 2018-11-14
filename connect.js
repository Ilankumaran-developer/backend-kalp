

module.exports = (callback)=>{
    const config = require('./config.js')

const construct = (cb)=>{
    let str = config.protocol+"://"+config.username+":"+config.password+"@ds121955.mlab.com:"+config.port+"/"+config.database;
    cb(str)
}
const start = ()=>{
    construct(async (data)=>{
        const mongoose = require('mongoose');
        mongoose.connect(data,{ useNewUrlParser: true },(err)=>{
            console.log('errrr',err)
            callback();
       })
       
        
    })
}
start();
}