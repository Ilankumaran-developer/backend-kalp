'use strict';
const DBhelper = require('../../helpers/db_accessors.js')

class Products extends DBhelper {
    constructor(models) {
        super(models)
        this.models = models;
        this.save = this.save.bind(this);
        this.show = this.show.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.findbyid = this.findbyid.bind(this);
        this.findProdDetails = this.findProdDetails.bind(this);
        this.sayHello = this.sayHello.bind(this);
    }
    async sayHello(req,res){
        res.send({"message":"hello world"});
    }
    async save(req, res) {
        let me = this;
        let payload = req.body;
        payload.date_created = new Date();
        let profit = parseInt(req.body.selling_price) - parseInt(req.body.cost_price)
        let profit_percentage = parseInt(profit) / parseInt(req.body.cost_price) * 100;
        payload.profit = profit_percentage
        let response = me.saveData('products', payload);
        res.send(response)
    }
    async show(req, res) {
        let me = this;
        me.findData('products',(response)=>{
            res.send(response);
        });
        
    }
    async delete(req, res) {
        let me = this;
        let response = this.deleteData('products', { id: req.body._id });
        res.send(response)
    }
    async findbyid(req, res) {
        let me = this;
        me.findDataById('products', { id: req.body.id },(response)=>{
            res.send(response);
        });
        
    }
    async update(req, res) {
        let me = this;
        let obj = {
            productname: req.body.productname,
            cost_price: req.body.cost_price,
            selling_price: req.body.selling_price,
            description: req.body.description
        }
        let profit = parseInt(req.body.selling_price) - parseInt(req.body.cost_price)
        let profit_percentage = parseInt(profit) / parseInt(req.body.cost_price) * 100;
        obj.profit = profit
        let response = me.updateData('products', { payload: obj, id: req.body.id })
        res.send(response)
    }

    async findProdDetails(req,res){
        let me = this;
        me.findIn('products',{'_id':{$in:req.body.ids}},(response)=>{
            res.send(response)
        })
        
    }




}

module.exports = Products