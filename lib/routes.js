'use strict';
const Products = require('./services/product_services'),
Transactions = require('./services/transaction_services'),
Mailer = require('./services/mailer_services');


class Routes {
    constructor(app, models) {
        try{
            this.product = new Products(models);
            this.transaction = new Transactions(models);
            this.mailer = new Mailer(models)
            this.init(app);
        }catch(e){
            console.log('err', e)
           
        }
      
    }
    init(app) {
        try{
            let me = this;
            app.get('/hello', me.product.sayHello);
            app.post('/save', me.product.save);
            app.get('/show', me.product.show);
            app.post('/deleteProduct', me.product.delete);
            app.post('/showbyid', me.product.findbyid)
            app.post('/update', me.product.update)
            app.get('/showtransactions', me.transaction.show);
            app.post('/saveTransaction', me.transaction.save)
            app.post('/showtransbyid', me.transaction.findbyid);
            app.post('/deleteTransaction', me.transaction.delete);
            app.post('/getProdDetails', me.product.findProdDetails);
            app.get('/forDev', me.product.forDev)
            app.post('/saveMailsettings', me.mailer.saveConfig);
            app.get('/getConfig',me.mailer.getConfig);
            app.get('/deleteConfig', me.mailer.delete)
        }catch(e){
            console.log(e)
        }
       
    }
}
module.exports = Routes
