const express = require('express');
const app = express();



const models = require('./models.js');
const Crud = require('./crud.js')

const crud = new Crud(models)

const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
require('./connect.js')(()=>{

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function callback () {
        
      });
      app.listen(2018,()=>{
        console.log('server started')
    })
});
//app.get('/',crud.show)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.post('/save',crud.save);
app.get('/show',crud.show);
