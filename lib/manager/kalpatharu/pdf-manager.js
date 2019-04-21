'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),
Fs = require('fs'),
Path = require('path'),
Util = require('util'),
Puppeteer = require('puppeteer'),
Handlebars = require('handlebars'),
_ = require('lodash'),
ReadFile = Util.promisify(Fs.readFile);



class PDFManager extends DBhelper {
    constructor(models, config){
        super(models);
        this._bindTemplate = this._bindTemplate.bind(this);
        this.createPDF = this.createPDF.bind(this);

    }
    async createPDF(orderData){
        try{
            let me = this;
       
        let html = await me._bindTemplate(orderData);
        let browser = await Puppeteer.launch({ headless: true });
        let page = await browser.newPage()
        
        await page.setContent(html);
        let d = new Date().getTime();
        let filename = `invoice-${orderData.order_id}-${d.toString().substr(-1,2)}.pdf`;
        let pdf = await page.pdf({ format: 'A4',path:`./lib/pdf/${filename}`});
        return filename;
        
        }catch(e){

            console.log(e)
            return e;
        }
        

    }
   
   async _bindTemplate(orderData){
       try{
        let me = this;
        
        const content = await ReadFile(Path.join(__dirname, './../../templates/invoiceTemplates.html'), 'utf8');
        const templateContent = Handlebars.compile(content);
        let data = Helper.loadRequiredTemplateDataforInvoicePDF(orderData);
        return templateContent(data);
       }catch(e){
           return e;
       }
       
    }
}

module.exports = PDFManager;