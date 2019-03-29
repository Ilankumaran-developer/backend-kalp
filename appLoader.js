const rootConfig = require('./config.json'),
BaseAppLoader = require('./baseAppLoader.js'),
cors = require('cors'),
_ = require('lodash'),
express = require('express'),
bodyParser = require('body-parser');


class Apploader extends BaseAppLoader{
    constructor(project, app){

        super(project, rootConfig);
        this.bootApp = this.bootApp.bind(this);
        this.setCORS = this.setCORS.bind(this);
        this.startServer = this.startServer.bind(this);
        this.setBodyParser = this.setBodyParser.bind(this);
        this.app = app;
        this.project = project;
        this.config = rootConfig[this.project];

    }
    async bootApp(){
        try{
            let me = this;
            if(await me.connectDB()){
                me.startServer();
                me.setCORS();
                me.setBodyParser();
                let models = me.loadModels();
                me.loadRoutes(me.app,models);
            }
        }catch(e){
            console.log(e)
            throw e;
        }
        

    }
    async startServer(){
        let me = this;
        try{
            me.app.listen(process.env.PORT || _.get(me.config, 'port', 2013),()=>{
                console.log(`server started with the port ${_.get(me.config, 'port', 2013)}`);
            })
        }catch(e){
            throw e;
        }
    }

    async setCORS()
    {
        try{
            let me = this;
            me.app.use(cors({origin: `${me.config.protocol}://${me.config.host}:3000`,credentials: true}));
        }catch(e){
            console.log(e)
            throw e;
        }
    }
    async setBodyParser(){
    try{
        let me = this;
        me.app.use(bodyParser.urlencoded({ extended: false }));
        me.app.use(bodyParser.json())
        }catch(e){
            throw e;
        }
    }
}
module.exports = Apploader;