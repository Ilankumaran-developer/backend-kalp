'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),
_ = require('lodash');



class InventoryManager extends DBhelper {
    constructor(models, config){
        super(models);
        this.getInventory = this.getInventory.bind(this);
       

    }
    async getInventory(options){
        let me = this;
        try{
            let response = await me.findData('inventory', options);
            return response;
        }catch(e){
            throw e;
        }
    }
}
module.exports = InventoryManager;