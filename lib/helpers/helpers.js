const _ = require('lodash'),
path = require('path');

const helper = {
    unitToGram(unit){
        return parseFloat(unit) * 1000;
    },
    getStack(){
        const _ = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const stack = new Error().stack.slice(1);
        Error.prepareStackTrace = _;
        return stack;
      },
    projectRequire(relpath, config){
        let fileContext = this.getStack()[1].getFileName();
        try{
            
            fileContext = fileContext.slice(0, fileContext.lastIndexOf('/'));
            const lastSlashIdx = relpath.lastIndexOf('/');
        const projectpath = `${relpath.slice(0, lastSlashIdx + 1)}${config['project_name']}${relpath.slice(lastSlashIdx)}`;
    
        return require('./' + path.relative(__dirname, `${fileContext}/${projectpath}`));

        }catch(e){
      
            return require('./' + path.relative(__dirname, `${fileContext}/${relpath}`));
        }
        
    },
    loadRequiredTemplateDataforInvoicePDF(order, table){
        let payload  = {};
        payload.id = order._id;
        payload.user = order.user;
        payload.date_created = order.date_created;
        payload.tableDetails = table;
        payload.subtotal = order.total;
        payload.service_tax = order.service_tax;
        payload.grand_total = order.grand_total;
        return payload;

    }  
}

module.exports = helper;