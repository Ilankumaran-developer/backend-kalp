
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    productname: String,
    cost_price: Number,
    description:String,
    selling_price: Number,
    date_created:Date,
    profit:Number
})

const transSchema = new Schema({
    user: String,
    transaction:[],
    service_tax: Number,
    total:Number,
    profit:Number,
    grand_total:Number,
    date_created:Date,
    product_ids:[]
   
})


const settingsSchema = new Schema({
  product:{},
  mail:{}
   
})



const load = {
    products: productSchema,
    transactions : transSchema
}

module.exports = load;