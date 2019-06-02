'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),
ProductManager = require('../../manager/kalpatharu/product-manager'),
shortId = require('shortid'),
 _ = require('lodash');

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
        this.ProductManager = new ProductManager(models, config);
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
            let prefix = 'SKU-';
            payload.sku = `${prefix}${shortId.generate()}`;
            payload.status = 'out_of_stock';
            let response = await me.saveData('products', payload);
            res.send(response)
        }catch(e){
            res.send(e)
        }
       
    }
    async show(req, res) {
        let me = this;
        try{
            let options = req.query.status ? {status:req.query.status} : {}
            console.log(options)
            let response = await me.findData('products',options);
            console.log(response)
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
            let options = {
                _id: req.body.id
            }
            let response = await me.updateData('products', { payload: obj, options: options })
            res.send(response)
        }catch(e){
            res.send(e);
        }
    }

    async findProdDetails(req,res){
        let me = this;
        try{
            let response = await me.ProductManager.findProducts(req.body)
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