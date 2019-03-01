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
        this.forDev = this.forDev.bind(this);
    }
    async sayHello(req,res){
        res.send({"message":"hello world"});
    }
    async save(req, res) {
        let me = this;
        let payload = req.body;
        payload.date_created = new Date();
        let profit = parseFloat(req.body.selling_price) - parseFloat(req.body.cost_price)
        let profit_percentage = parseFloat(profit) / parseFloat(req.body.cost_price) * 100;
        payload.profit = profit_percentage
        let response = await me.saveData('products', payload);
        res.send(response)
    }
    async show(req, res) {
        let me = this;
        let response = await me.findData('products');
        //('ddsds',response);
        res.send(response);
        
    }
    async delete(req, res) {
        let me = this;
        await me.deleteData('products', { id: req.body._id });
        let resp =  await me.findData('products');
        res.send(resp);
    }
    async findbyid(req, res) {
        let me = this;
        let response = await me.findDataById('products', { id: req.body.id });
        res.send(response);
        
    }
    async update(req, res) {
        let me = this;
        let obj = {
            productname: req.body.productname,
            cost_price: req.body.cost_price,
            selling_price: req.body.selling_price,
            description: req.body.description
        }
        let profit = parseFloat(req.body.selling_price) - parseFloat(req.body.cost_price)
        let profit_percentage = parseFloat(profit) / parseFloat(req.body.cost_price) * 100;
        obj.profit = profit
        let response = await me.updateData('products', { payload: obj, id: req.body.id })
        res.send(response)
    }

    async findProdDetails(req,res){
        let me = this;
        let response = await me.findIn('products',{'_id':{$in:req.body.ids}});
        res.send(response);
        
    }
    async forDev(req,res){
        let me = this;
        me.findData('products',(response)=>{
            res.send(response)
        })
    }




}

module.exports = Products