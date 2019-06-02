'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
    ProductManager = require('../../manager/kalpatharu/product-manager'),
    shortId = require('shortid'),
    path = require('path'),
    InventoryManager = require('../../manager/kalpatharu/inventory-manager'),
    PDFManager = require('../../manager/kalpatharu/pdf-manager');
const _ = require('lodash');
const fs = require('fs');
const Path = require('path');
class Orders extends DBhelper {
    constructor(models, config) {
        super(models);
        this.models = models;
        this.config = config;
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);
        this.findbyid = this.findbyid.bind(this);
        this.delete = this.delete.bind(this);
        this.makePDF = this.makePDF.bind(this);
        this._loadOptions = this._loadOptions.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.flusheverything = this.flusheverything.bind(this);
        this._allocateInventory = this._allocateInventory.bind(this);
        this.PDFManager = new PDFManager(models, config);
        this.InventoryManager = new InventoryManager(models, config);
        this.ProductManager = new ProductManager(models, config);
        this.tryFTP = this.tryFTP.bind(this);
        this.backup = this.backup.bind(this);
    }
    async show(req, res) {
        try {
            let me = this;
            let options = me._loadOptions(req.query);
            let response = await me.findData('orders', options);
            res.send(response);
        } catch (e) {
            res.send(e);
        }

    }
    async save(req, res) {
        let me = this;
        try {
            let payload = req.body;
            payload.date_created = new Date();
            let prefix = 'kalp-';
            payload.order_id = `${prefix}${shortId.generate()}`;
            await me._allocateInventory(payload.line_items);
            let response = me.saveData('orders', payload);
            res.send(response);
        } catch (e) {
            console.log(e)
            res.send(e)
        }

    }
    async _allocateInventory(line_items) {
        let me = this;
        for (let line_item of line_items) {
            console.log(line_item)
            let options = { sku: line_item.sku };
            let inventory = await me.InventoryManager.getInventory(options)

            let inventoryData = inventory[0];
            let payload = {}, productPayload = {};

            payload.total_sales = parseFloat(_.get(inventoryData, 'total_sales.value', inventoryData.total_sales)) + parseFloat(line_item['unit']);
            payload.quantity = parseFloat(_.get(inventoryData, 'quantity.value', inventoryData.quantity)) - parseFloat(line_item['unit']);
            payload.quantity = parseFloat(payload.quantity).toFixed(1);
            payload.status = inventoryData.status;
            console.log(payload)
            if (parseFloat(payload.quantity) < 0.1) {
                let product = await me.findData('products', options);
                productPayload = product[0];
                payload.status = 'out_of_stock';
                productPayload.status = 'out_of_stock';
                let options2 = { _id: productPayload._id }
                await me.updateData('products', { payload: productPayload, options: options2 })
            }
            let options1 = { _id: inventoryData._id }
            payload.sku = inventoryData.sku;
            await me.updateData('inventory', { payload: payload, options: options1 })
        }
    }
    async findbyid(req, res) {
        let me = this;
        try {
            let response = await me.findDataById('orders', { id: req.body.id });
            res.send(response);
        } catch (e) {
            res.send(e)
        }

    }
    async delete(req, res) {
        let me = this;
        try {
            await me.deleteData('orders', { id: req.body._id });
            let returndata = await me.findData('orders');
            res.send(returndata);
        } catch (e) {
            res.send(e)
        }

    }
    async downloadPDF(req, res) {
        try {
            let pathname = path.join(__dirname, './../../pdf/');
            let filename = req.query.filename;
            res.download(pathname + filename);
        } catch (e) {
            res.send(e)
        }

    }
    async makePDF(req, res) {
        let me = this;
        try {
            let orderData = await me.findDataById('orders', { id: req.query.id });

            if (orderData) {
                let pdf = await me.PDFManager.createPDF(orderData);

                res.send(pdf)
            }
            else {
                res.send({})
            }

        } catch (e) {
            res.send(e)
        }
    }
    _loadOptions(payload) {
        let from_time = _.get(payload, 'from', undefined);
        let to_time = _.get(payload, 'to', undefined);
        let options = {}
        if (!_.isEmpty(from_time) || !_.isEmpty(to_time)) {
            options = { $and: [] }
            if (!_.isEmpty(from_time))
                options.$and.push({ "date_created": { $gte: from_time } })
            if (!_.isEmpty(to_time))
                options.$and.push({ "date_created": { $lte: to_time } });
        }

        return options;
    }
    async flusheverything(req, res) {
        let me = this;
        await me.truncateModel('orders', {});
        await me.truncateModel('products', {});
        await me.truncateModel('inventory', {});
        res.send({ "message": "Task Completed" });
    }
    async _getFolders(Ftp) {
        console.log(Ftp)
        return new Promise((resolve, reject) => {
            console.log('calling....')
            Ftp.raw("ls", (err, data) => {
                console.log(err,data)
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            });
        })

    }
    async backup(req, res){
        let me = this;
        try{
            let orders = await me.findData('orders');
        let products = await me.findData('products');
        let inventory = await me.findData('inventory');
        let data = {orders, products, inventory}
        let fname = Path.join(__dirname, `backup/backup${new Date().getTime()}.json`);
        await fs.writeFileSync(fname, JSON.stringify(data))
        
        res.download(fname);
        }catch(e){
            console.log(e)
            res.send(e)
        }
        
        

    }
    async tryFTP(req, res) {
        let me = this;
        try {
            let config = {
                host: 'generationinfinite.com',
                port: 21,
                user: 'sb@generationinfinite.com',
                pass: '/rehCpjOWAph2oKd9U59cELKOWcj9tXlMX1g+wioUguPDaQFf7goAwq07R39jMgNN5No21baR2rn9ivf2fmxHnpMT9LHeomRFVv6kaoL8CKYexvKv8jfF7EBccXCwQux'
            };
            const jsftp = require("jsftp");
            const Ftp = new jsftp(config);
            let data = await me._getFolders(Ftp);
            console.log('the folders', data);
            res.send(data)

        } catch (err) {
            console.log(err)
            res.send(err)
        }
    }

}
module.exports = Orders