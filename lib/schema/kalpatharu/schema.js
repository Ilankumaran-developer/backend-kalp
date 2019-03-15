
const mongoose = require('mongoose')
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const productSchema = new Schema({
    productname: String,
    cost_price: SchemaTypes.Double,
    description:String,
    selling_price: SchemaTypes.Double,
    date_created:Date,
    profit:SchemaTypes.Double,
    min_unit:SchemaTypes.Double,
    price_per_gram:SchemaTypes.Double
})

const transSchema = new Schema({
    user: String,
    transaction:[],
    service_tax: SchemaTypes.Double,
    total:SchemaTypes.Double,
    profit:SchemaTypes.Double,
    grand_total:SchemaTypes.Double,
    date_created:Date,
    product_ids:[]
   
})


const mailConfigSchema = new Schema({
    host: String,
    from: String,
    service:String,
    username: String,
    password: String,

   
})



const load = {
    products: productSchema,
    transactions : transSchema,
    mailer : mailConfigSchema
}

module.exports = load;