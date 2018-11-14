
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    productname: String,
    cost_price: Number,
    description:String,
    percentage: Number,
    date_created:Date
})



const load = {
    products: productSchema
}

module.exports = load;