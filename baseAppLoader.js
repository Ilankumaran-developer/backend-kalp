const _ = require('lodash'),
mongoose = require('mongoose'),
Helper = require('./lib/helpers/helpers.js')

class BaseAppLoader{
    constructor(project, rootConfig){
        this.connectDB = this.connectDB.bind(this);
        this.project = project;
        this.config = rootConfig[this.project];
     
        this._constructConnectionString = this._constructConnectionString.bind(this);
        this._buildConnection = this._buildConnection.bind(this);
        this.loadModels = this.loadModels.bind(this);
        this.loadRoutes = this.loadRoutes.bind(this);
    }

    async connectDB(){
        let me  = this;
        let conStr = me._constructConnectionString();
        await me._buildConnection(conStr);
        return true;
    }
    _constructConnectionString(){
        try{
            let me = this;
            let dbConfig = _.get(me.config, 'config_db');
            let str = `${dbConfig.protocol}://${dbConfig.username}:${dbConfig.password}@ds121955.mlab.com:${dbConfig.port}/${dbConfig.database}`;
            return str;
        }catch(e){
            throw e;
        }
       
    }
    async _buildConnection(str){
        return new Promise((resolve,reject)=>{
            try{

                mongoose.connect(str,{ useNewUrlParser: true },(err)=>{
                    if(err)
                        reject(err)
                    const db = mongoose.connection;
                    db.on('error', console.error.bind(console, 'connection error:'));
                    db.once('open', function callback () {
                    });
                    resolve(1);
                })
            }catch(e){
                reject(e);
            }
        })
        
    }

    loadModels(){
        const schema = Helper.projectRequire('./lib/schema/schema.js', this.config);
        let models = {};
        _.forEach(schema,(value,key)=>{
            models[key] = mongoose.model(key, value);
        })
        return models
    }
    loadRoutes(app, models){
        const Routes = Helper.projectRequire('./lib/routes/routes.js', this.config);
        const routes = new Routes(app,models,this.config);
        routes.init();
    }
}

 module.exports = BaseAppLoader;