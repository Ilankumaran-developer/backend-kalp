
const mongoose = require('mongoose')
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const productSchema = new Schema({
    sku : String,
    productname: String,
    cost_price: SchemaTypes.Double,
    description:String,
    selling_price: SchemaTypes.Double,
    date_created:Date,
    profit:SchemaTypes.Double,
    min_unit:SchemaTypes.Double,
    price_per_gram:SchemaTypes.Double,
    status:String
})


const ordersSchema = new Schema({
   
    status : String,
    order_id : String,
    user: String,
    line_items:[],
    service_tax: SchemaTypes.Double,
    total:SchemaTypes.Double,
    profit:SchemaTypes.Double,
    grand_total:SchemaTypes.Double,
    date_created:Date,
    product_ids:[],
    quantity : Number
   
})


const mailConfigSchema = new Schema({
    host: String,
    from: String,
    service:String,
    username: String,
    password: String,

   
})

const inventorySchema = new Schema({
    sku : String,
    total_sales : SchemaTypes.Double,
    quantity : SchemaTypes.Double,
    status : String
})



const load = {
    products: productSchema,
    mailer : mailConfigSchema,
    orders : ordersSchema,
    inventory : inventorySchema
}

module.exports = load;