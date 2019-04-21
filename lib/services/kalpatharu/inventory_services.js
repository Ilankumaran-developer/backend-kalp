'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),

InventoryManager = require('../../manager/kalpatharu/inventory-manager'),
ProductManager = require('../../manager/kalpatharu/product-manager'),
shortId = require('shortid'),
 _ = require('lodash');

class Inventory extends DBhelper{
    constructor(models, config){
        super(models);
        this.list = this.list.bind(this);
        this.getInventory = this.getInventory.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
        this.InventoryManager = new InventoryManager(models, config);
        this.ProductManager = new ProductManager(models, config);
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
            
            res.send(response);
        }catch(e){
            console.log(e)
            res.send(e);
        }
    }
    async updateInventory(req,res){
        let me = this;
      
        try{
            if(req.body.id != 0){
                let response = await me.findDataById('inventory', { id: req.body.id });
               
                    if(response){
                        
                        let payloadData = {};
                payloadData.status = req.body.status;
                payloadData.quantity = parseInt(req.body.quantity);
                payloadData.total_sales = response.total_sales;
                payloadData.sku = req.body.sku;
                let options = {sku: payloadData.sku }
                let response1 = await me.updateData('inventory', { payload: payloadData, options: options })
                
                let productData = await me.findData('products', { sku : req.body.sku});
            
                let prodId = req.body.productID
                let productPayload  = _.pick(_.cloneDeep(productData[0]), ['cost_price','productname','description','selling_price','min_unit','status','date_created','profit','price_per_gram','sku']);
                productPayload.status = req.body.status;
                productPayload.id = prodId;
                
                let prodUpdate = await me.ProductManager.updateProduct(productPayload)
                
                res.send(prodUpdate);
                }
            }else{
                let payload = {};
                payload.status = req.body.status;
                payload.quantity = parseInt(req.body.quantity);
                payload.total_sales = 0;
                payload.sku = req.body.sku;
                let response = await me.saveData('inventory', payload);
                let productData = await me.findData('products', { sku : req.body.sku});
                let prodId = req.body.productID;
                let productPayload  = _.pick(_.cloneDeep(productData[0]), ['cost_price','productname','description','selling_price','min_unit','status','date_created','profit','price_per_gram','sku']);
                productPayload.id = prodId;
                productPayload.status = req.body.status;
                let prodUpdate = await me.ProductManager.updateProduct(productPayload)
                
                res.send(response)
            }
           
           
        }catch(e){
            res.send(e);
        }
    }
}

module.exports = Inventory;