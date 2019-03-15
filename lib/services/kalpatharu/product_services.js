'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js');
const _ = require('lodash');

class Products extends DBhelper {
    constructor(models, config) {
        super(models)
        this.models = models;
        this.config = config;
        this.save = this.save.bind(this);
        this.show = this.show.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.findbyid = this.findbyid.bind(this);
        this.findProdDetails = this.findProdDetails.bind(this);
        this.sayHello = this.sayHello.bind(this);
        this.forDev = this.forDev.bind(this);
    }
    async sayHello(req,res){
        res.send({"message":"hello world"});
    }
    async save(req, res) {
        let me = this;
        try{
            let payload = req.body;
            payload.date_created = new Date();
            let profit = parseFloat(req.body.selling_price) - parseFloat(req.body.cost_price)
            let profit_percentage = parseFloat(profit) / parseFloat(req.body.cost_price) * 100;
            let grams = Helper.unitToGram(req.body.min_unit);
            let price_per_gram = parseFloat(req.body.selling_price) / parseFloat(grams);
            payload.profit = profit_percentage;
            payload.price_per_gram = price_per_gram;
            let response = await me.saveData('products', payload);
            res.send(response)
        }catch(e){
            res.send(e)
        }
       
    }
    async show(req, res) {
        let me = this;
        try{
            let response = await me.findData('products');
            res.send(response);
        }catch(e){
            res.send(e);
        }
    }
    async delete(req, res) {
        let me = this;
        try{
            await me.deleteData('products', { id: req.body._id });
            let resp =  await me.findData('products');
            res.send(resp);
        }catch(e){
            res.send(e);
        }
      
    }
    async findbyid(req, res) {
        let me = this;
        try{
            let response = await me.findDataById('products', { id: req.body.id });
            res.send(response);
        }catch(e){
            res.send(e);
        }
        
        
    }
    async update(req, res) {
        let me = this;
        try{
            let obj = {
                productname: req.body.productname,
                cost_price: req.body.cost_price,
                selling_price: req.body.selling_price,
                description: req.body.description
            }
            let profit = parseFloat(req.body.selling_price) - parseFloat(req.body.cost_price)
            let profit_percentage = parseFloat(profit) / parseFloat(req.body.cost_price) * 100;
            obj.profit = profit
            let response = await me.updateData('products', { payload: obj, id: req.body.id })
            res.send(response)
        }catch(e){
            res.send(e);
        }
    }

    async findProdDetails(req,res){
        let me = this;
        try{
            let ids = _.values(_.omitBy(req.body.ids, _.isEmpty));
            let response = await me.findIn('products',{'_id':{$in:ids}});
            res.send(response);
        }catch(e){
  
            res.send(e)
        }
    }
    async forDev(req,res){
        let me = this;
        try{
           let response =  me.findData('products');
           res.send(response)
        }catch(e){
            res.send(e)
        }
    }




}

module.exports = Products