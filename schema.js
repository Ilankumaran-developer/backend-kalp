
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



const load = {
    products: productSchema
}

module.exports = load;