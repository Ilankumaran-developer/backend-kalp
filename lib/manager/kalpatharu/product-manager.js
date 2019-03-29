'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),
 _ = require('lodash');

class ProductManager extends DBhelper {
    constructor(models, config){
        super(models);
        this.findProducts = this.findProducts.bind(this);
    }

    async findProducts(payload){
      if(_.get(payload, 'ids')){
        let me = this;
        try{
            let ids = payload.ids;
            let response = await me.findIn('products',{'_id':{$in:ids}});
            console.log('reeee',response)
            return response;
        }catch(e){
            return e;
        }
      }else{
            return [];
      }
       

    }
}
module.exports = ProductManager