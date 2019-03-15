'use strict';
const DBhelper = require('../../helpers/db_accessors.js')
const _ = require('lodash');
class Transactions extends DBhelper {
    constructor(models, config) {
        super(models);
        this.models = models;
        this.config = config;
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);
        this.findbyid = this.findbyid.bind(this);
        this.delete = this.delete.bind(this);
    }
    async show(req, res) {
        try{
        let me = this;
        let from_time  = _.get(req, 'query.from',undefined);
        let to_time = _.get(req, 'query.to', undefined);
        let options = {}
        if(!_.isEmpty(from_time) || !_.isEmpty(to_time))
        {
            options = {$and:[]}
            if(!_.isEmpty(from_time))
            options.$and.push({"date_created":{$gte:from_time}})
            if(!_.isEmpty(to_time))
            options.$and.push({"date_created":{$lte: to_time}});
        }
  
        let response  = await me.findData('transactions',options);
        res.send(response);
        }catch(e)
        {
            res.send(e);
        }
       
    }
    async save(req, res) {
        let me = this;
        try{
            let payload = req.body;
        payload.date_created = new Date();
        let response = me.saveData('transactions', payload);
        res.send(response);
        }catch(e){
            res.send(e)
        }
        
    }
    async findbyid(req, res) {
        let me = this;
        try{
            let response = await  me.findDataById('transactions', { id: req.body.id });
            res.send(response);
        }catch(e){
            res.send(e)
        }
        
    }
    async delete(req, res) {
        let me = this;
        try{
            await me.deleteData('transactions', { id: req.body._id });
            let returndata = await  me.findData('transactions');
            res.send(returndata);
        }catch(e){
            res.send(e)
        }
       
    }
    
}
module.exports = Transactions