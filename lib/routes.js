'use strict';
const Products = require('./services/products/product_services')
const Transactions = require('./services/transactions/transaction_services');

class Routes {
    constructor(app, models) {
        
        this.product = new Products(models);
        this.transaction = new Transactions(models);
        this.init(app);
    }
    init(app) {
        app.get('/hello', this.product.sayHello);
        app.post('/save', this.product.save);
        app.get('/show', this.product.show);
        app.post('/deleteProduct', this.product.delete);
        app.post('/showbyid', this.product.findbyid)
        app.post('/update', this.product.update)
        app.get('/showtransactions', this.transaction.show);
        app.post('/saveTransaction', this.transaction.save)
        app.post('/showtransbyid', this.transaction.findbyid);
        app.post('/deleteTransaction', this.transaction.delete);
        app.post('/getProdDetails', this.product.findProdDetails);
        app.get('/forDev', this.product.forDev)
    }
}
module.exports = Routes
