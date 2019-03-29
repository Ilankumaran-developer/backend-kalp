'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
ProductManager = require('../../manager/kalpatharu/product-manager'),
PDFManager = require('../../manager/kalpatharu/pdf-manager');
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
        this.makePDF = this.makePDF.bind(this);
        this._loadOptions = this._loadOptions.bind(this);
        this.PDFManager = new PDFManager(models, config);
        this.ProductManager = new ProductManager(models, config);
    }
    async show(req, res) {
        try{
        let me = this;
        let options = me._loadOptions(req.query);
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
    async makePDF(req,res){
        let me = this;
        try{
            let orderData = await  me.findDataById('transactions', { id: req.query.id });
        
            if(orderData){
               
                let productData = await me.ProductManager.findProducts({ids:orderData.product_ids});
                let pdf = await me.PDFManager.createPDF(orderData, productData);
                
                res.send(pdf)
            }
            else{
                res.send({})
            }
         
        }catch(e){
            res.send(e)
        }
    }
    _loadOptions(payload){
        let from_time  = _.get(payload, 'from',undefined);
        let to_time = _.get(payload, 'to', undefined);
        let options = {}
        if(!_.isEmpty(from_time) || !_.isEmpty(to_time))
        {
            options = {$and:[]}
            if(!_.isEmpty(from_time))
            options.$and.push({"date_created":{$gte:from_time}})
            if(!_.isEmpty(to_time))
            options.$and.push({"date_created":{$lte: to_time}});
        }

        return options;
    }
    
}
module.exports = Transactions