'use strict';

class Routes {
    constructor(app, models,config) {
        try{
           
            this.app = app;
            this.models = models;
            this.config = config;
        }catch(e){
            console.log('err', e)
           
        }
      
    }
    init() {
        
        try{
            let me = this;
            const Products = require('./../../services/kalpatharu/product_services'),
            Mailer = require('./../../services/kalpatharu/mailer_services'),
            Inventory = require('./../../services/kalpatharu/inventory_services'),
            Orders = require('./../../services/kalpatharu/order-services');

            let product = new Products(me.models, me.config);
            let orders = new Orders(me.models, me.config);
            let mailer = new Mailer(me.models, me.config);
            let inventory = new Inventory(me.models, me.config);

            me.app.get('/hello', product.sayHello);
            me.app.post('/save', product.save);
            me.app.get('/show', product.show);
            me.app.post('/deleteProduct', product.delete);
            me.app.post('/showbyid', product.findbyid)
            me.app.post('/update', product.update)
            me.app.get('/showorders', orders.show);
            me.app.post('/saveOrder', orders.save)
            me.app.post('/showordersbyid', orders.findbyid);
            me.app.post('/deleteOrders', orders.delete);
            me.app.post('/getProdDetails', product.findProdDetails);
            me.app.get('/makePDF', orders.makePDF);
            me.app.get('/downloadPDF', orders.downloadPDF);
            me.app.get('/forDev', product.forDev)
            me.app.post('/saveMailsettings', mailer.saveConfig);
            me.app.get('/getConfig', mailer.getConfig);
            me.app.get('/deleteConfig', mailer.delete);
            me.app.post('/sendEmail', mailer.sendEmail);
            me.app.get('/list/Inventory', inventory.list);
            me.app.get('/get/Inventory', inventory.getInventory)
            me.app.post('/updateInventory',inventory.updateInventory)
            me.app.get('/flusheverything', orders.flusheverything);
            me.app.get('/backupData', orders.backup)
            me.app.get('/tryFTP', orders.tryFTP)
           
            
            
        }catch(e){
            console.log(e)
        }
       
    }
}
module.exports = Routes
