const express = require('express'),
app = express(),
appLoader = require('./appLoader');

const AppLoader = new appLoader(process.argv[process.argv.length-1],app);
try{
  AppLoader.bootApp();
}catch(e){
  console.log(e)
}
