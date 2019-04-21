'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
ProductManager = require('../../manager/kalpatharu/product-manager'),
shortId = require('shortid'),
path = require('path'),
InventoryManager = require('../../manager/kalpatharu/inventory-manager'),
PDFManager = require('../../manager/kalpatharu/pdf-manager');
const _ = require('lodash');
class Orders extends DBhelper {
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
        this.downloadPDF = this.downloadPDF.bind(this);
        this.flusheverything = this.flusheverything.bind(this);
        this._allocateInventory = this._allocateInventory.bind(this);
        this.PDFManager = new PDFManager(models, config);
        this.InventoryManager = new InventoryManager(models, config);
        this.ProductManager = new ProductManager(models, config);
    }
    async show(req, res) {
        try{
        let me = this;
        let options = me._loadOptions(req.query);
        let response  = await me.findData('orders',options);
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
        let prefix = 'kalp-';
        payload.order_id = `${prefix}${shortId.generate()}`;
        await me._allocateInventory(payload.line_items);
        let response = me.saveData('orders', payload);
        res.send(response);
        }catch(e){
            console.log(e)
            res.send(e)
        }
        
    }
    async _allocateInventory(line_items){
        let me = this;
        for(let line_item of line_items){
            let options = {sku:line_item.sku};
            let inventory = await me.InventoryManager.getInventory(options)
            
            let inventoryData = inventory[0];
            let payload  = {}, productPayload = {};
            
            payload.total_sales = parseFloat(inventoryData.total_sales) + 1;
            payload.quantity = parseFloat(inventoryData.quantity) - 1;
            payload.status = inventoryData.status;
            if(parseInt(payload.quantity) < 1)
            {
                let product =   await me.findData('products', options);
                productPayload = product[0];
                payload.status = 'out_of_stock';
                productPayload.status = 'out_of_stock';
                let options2 = {_id: productPayload._id}
                await me.updateData('products', { payload: productPayload, options:options2})
            }
            let options1 = {_id: inventoryData._id}
            payload.sku = inventoryData.sku;
            await me.updateData('inventory', { payload: payload, options: options1 })
        }
    }
    async findbyid(req, res) {
        let me = this;
        try{
            let response = await  me.findDataById('orders', { id: req.body.id });
            res.send(response);
        }catch(e){
            res.send(e)
        }
        
    }
    async delete(req, res) {
        let me = this;
        try{
            await me.deleteData('orders', { id: req.body._id });
            let returndata = await  me.findData('orders');
            res.send(returndata);
        }catch(e){
            res.send(e)
        }
       
    }
    async downloadPDF(req,res){
        try{
            let pathname = path.join(__dirname, './../../pdf/');
            let filename = req.query.filename;
            res.download(pathname+filename);
        }catch(e){
            res.send(e)
        }
      
    }
    async makePDF(req,res){
        let me = this;
        try{
            let orderData = await  me.findDataById('orders', { id: req.query.id });
        
            if(orderData){
                let pdf = await me.PDFManager.createPDF(orderData);
           
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
    async flusheverything(req,res){
        let me = this;
        await me.truncateModel('orders', {});
        await me.truncateModel('products', {});
        await me.truncateModel('inventory', {});
        res.send({"message":"Task Completed"});
    }
   
    
}
module.exports = Orders