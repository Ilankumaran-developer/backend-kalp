'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
 _ = require('lodash'),
 PDFManager = require('../../manager/kalpatharu/pdf-manager');

class Mailer extends DBhelper {
    constructor(models, config) {
        super(models)
        this.models = models;
        this.config = config;
        this.saveConfig = this.saveConfig.bind(this);
        this.getConfig = this.getConfig.bind(this);
        this.delete = this.delete.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.modelName = 'mailer';
        this.PDFManager = new PDFManager(models, config);

    }
async saveConfig(req,res){
    let me = this;
    try{
        let response;
        let payload = _.cloneDeep(req.body)
        let result = await  me.findData(me.modelName);
        if(result.length == 0)
            response = await me.saveData(me.modelName, payload);
        else{
            let obj = {};
            obj.host = req.body.host;
            obj.service = req.body.service;
            obj.username = req.body.username;
            obj.password = req.body.password;
            obj.from = req.body.from;
            let id = result[result.length-1]['_id'];
            let options  = {_id : id}
            response = await me.updateData(me.modelName, { payload: obj, options: options })
        }
        res.send(response);

    }catch(e){
        res.send(e);
    }
    
}

async getConfig(req,res){
    let me = this;
    try{
        let response = await  me.findData(me.modelName);
        res.send(response);
    }catch(e){

        res.send(e)
    }
}
async sendEmail(req,res){
    try{
        let me = this;
        let orderData = await  me.findDataById('orders', { id: req.body.id });
        
        let pdf = await me.PDFManager.createPDF(orderData);
        const MailerManager = require('../../manager/kalpatharu/mailer');
        let mailerManager = new MailerManager(me.models, me.config);
        let attachment = pdf;
        let options = {attachment};
        options.order = orderData;
        
        await mailerManager.sendEmail(options)
        res.send({status: 'success'});
    }catch(e){
        res.send(e)
    }
   
}
async delete(req, res) {
    let me = this;
    try{
        await me.deleteData(me.modelName, { id: req.query.id });
        let resp =  await me.findData(me.modelName);
        res.send(resp);
    }catch(e){
        res.send(e);
    }
  
}


   
}

module.exports = Mailer;