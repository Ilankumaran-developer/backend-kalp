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
        this._makeTable = this._makeTable.bind(this);
        this._bindTemplate = this._bindTemplate.bind(this);
        this.createPDF = this.createPDF.bind(this);

    }
    async createPDF(orderData, productData){
        try{
            let me = this;
        let tableData = me._makeTable(_.cloneDeep(orderData), _.cloneDeep(productData));
        let html = await me._bindTemplate(orderData, tableData);
        let browser = await Puppeteer.launch({ headless: true });
        let page = await browser.newPage()
        console.log('html', html)
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
    _makeTable(orderData, productData){
        try{
            let product = productData;
            let order = orderData.line_items;
            let tableData = []
            for(let i  in product)
            {
              let temp = []
              temp.push(`<td>${product[i].productname}</td>`)
              temp.push(`<td>${product[i].selling_price} per (${parseFloat(product[i].min_unit) * 1000}) grams</td>`)
              for(let j in order)
              {
                  if(order[j].product_id == product[i]._id)
                  {
                      temp.push(`<td>${parseFloat(order[j].unit) * 1000} grams</td>`)
                      temp.push(`<td>${parseFloat(order[j].selling_price).toFixed(2)}</td>`)
                  }
              }
              
              tableData.push(`<tr>${temp}</tr>`)
            }
            return tableData
        }catch(e){
            return e;
        }
       
    }
   async _bindTemplate(orderData, tableData){
       try{
        let me = this;
        
        const content = await ReadFile(Path.join(__dirname, './../../templates/invoiceTemplates.html'), 'utf8');
        const templateContent = Handlebars.compile(content);
        let data = Helper.loadRequiredTemplateDataforInvoicePDF(orderData, tableData);
        return templateContent(data);
       }catch(e){
           return e;
       }
       
    }
}

module.exports = PDFManager;