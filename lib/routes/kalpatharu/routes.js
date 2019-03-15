'use strict';

const Helper = require('./../../helpers/helpers.js')

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
            const Products = Helper.projectRequire('./../../services/product_services',me.config),
            Transactions = Helper.projectRequire('./../../services/transaction_services',me.config),
            Mailer = Helper.projectRequire('./../../services/mailer_services',me.config);

            let product = new Products(me.models, me.config);
            let transaction = new Transactions(me.models, me.config);
            let mailer = new Mailer(me.models, me.config)

            me.app.get('/hello', product.sayHello);
            me.app.post('/save', product.save);
            me.app.get('/show', product.show);
            me.app.post('/deleteProduct', product.delete);
            me.app.post('/showbyid', product.findbyid)
            me.app.post('/update', product.update)
            me.app.get('/showtransactions', transaction.show);
            me.app.post('/saveTransaction', transaction.save)
            me.app.post('/showtransbyid', transaction.findbyid);
            me.app.post('/deleteTransaction', transaction.delete);
            me.app.post('/getProdDetails', product.findProdDetails);
            me.app.get('/forDev', product.forDev)
            me.app.post('/saveMailsettings', mailer.saveConfig);
            me.app.get('/getConfig', mailer.getConfig);
            me.app.get('/deleteConfig', mailer.delete)
        }catch(e){
            console.log(e)
        }
       
    }
}
module.exports = Routes
