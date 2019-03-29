'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),

InventoryManager = require('../../manager/kalpatharu/inventory-manager'),
shortId = require('shortid'),
 _ = require('lodash');

class Inventory extends DBhelper{
    constructor(models, config){
        super(models);
        this.list = this.list.bind(this);
        this.getInventory = this.getInventory.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
        this.InventoryManager = new InventoryManager(models, config);
    }
    async list(req,res){
        let me = this;
        try{
            let response = await me.findData('inventory');
            res.send(response);
        }catch(e){
            res.send(e);
        }
    }
    async getInventory(req,res){
        let me = this;
        try{
            let options = req.query.sku ? {sku:req.query.sku} : {};
            let response = await me.InventoryManager.getInventory(options)
            console.log(response)
            res.send(response);
        }catch(e){
            console.log(e)
            res.send(e);
        }
    }
    async updateInventory(req,res){
        let me = this;
        console.log(req.body)
        try{
            if(req.body.id != 0){
                let response = await me.findDataById('inventory', { id: req.body.id });
                console.log(response)
                    if(response){
                        console.log('inside updating block');
                        let payload = {};
                payload.status = req.body.status;
                payload.quantity = parseInt(req.body.quantity);
                payload.total_sales = response.total_sales;
                payload.sku = req.body.sku;
                let response1 = await me.updateData('inventory', { payload: payload, id: req.body.id })
                console.log(response1)
                let productData = await me.findData('products', { sku : req.body.sku});
                let productPayload  = productData[0];
                productPayload.status = req.body.status;
                let prodUpdate = await me.updateData('products', { payload: productPayload, id: productPayload._id })
                res.send(response1);
                }
            }else{
                let payload = {};
                payload.status = req.body.status;
                payload.quantity = parseInt(req.body.quantity);
                payload.total_sales = 0;
                payload.sku = req.body.sku;
                let response = await me.saveData('inventory', payload);
                let productData = await me.findData('products', { sku : req.body.sku});
                let productPayload  = productData[0];
                productPayload.status = req.body.status;
                let prodUpdate = await me.updateData('products', { payload: productPayload, id: productPayload._id })
                res.send(response)
            }
           
           
        }catch(e){
            res.send(e);
        }
    }
}

module.exports = Inventory;