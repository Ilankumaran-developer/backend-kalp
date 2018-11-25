'use strict';
const DBhelper = require('../../helpers/db_accessors.js')

class Transactions extends DBhelper {
    constructor(models) {
        super(models);
        this.models = models;
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);
        this.findbyid = this.findbyid.bind(this);
        this.delete = this.delete.bind(this);
    }
    async show(req, res) {
        let me = this;
        me.findData('transactions',(response)=>{
            res.send(response)
        });
       
    }
    async save(req, res) {
        let me = this;
        let payload = req.body;
        payload.date_created = new Date();
        let response = me.saveData('transactions', payload);
        res.send(response);
    }
    async findbyid(req, res) {
        let me = this;
        me.findDataById('transactions', { id: req.body.id },(response)=>{
            res.send(response);
        });
        
    }
    async delete(req, res) {
        let me = this;
        let response = me.deleteData('transactions', { id: req.body._id });
        let returndata = me.findData('transactions');

        res.send({
            message: "Deleted Successfully",
            status: 1,
            products: returndata
        })
    }
    
}
module.exports = Transactions