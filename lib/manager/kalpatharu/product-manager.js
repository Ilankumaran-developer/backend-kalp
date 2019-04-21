'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),
 _ = require('lodash');

class ProductManager extends DBhelper {
    constructor(models, config){
        super(models);
        this.findProducts = this.findProducts.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
    }

    async findProducts(payload){
      if(_.get(payload, 'ids')){
        let me = this;
        try{
            let ids = payload.ids;
            let response = await me.findIn('products',{'_id':{$in:ids}});
            
            return response;
        }catch(e){
            return e;
        }
      }else{
            return [];
      }
    }
      async updateProduct(payload){
       
          let me = this;
          try{
            let obj = {
              productname: payload.productname,
              cost_price: _.get(payload , 'cost_price.value' , payload.cost_price),
              selling_price: _.get(payload, 'selling_price.value', payload.selling_price),
              description: payload.description,
              status: payload.status
          }
          let profit = parseFloat(_.get(payload, 'selling_price.value', payload.selling_price)) - parseFloat(_.get(payload , 'cost_price.value' , payload.cost_price))
          let profit_percentage = parseFloat(profit) / parseFloat(payload.cost_price) * 100;
          obj.profit = profit;
          let options = {sku : payload.sku }
          let response = await me.updateData('products', { payload: obj,  options : options })
          return response
          }catch(e){
              return e;
          }
     
      }
       

    
}
module.exports = ProductManager