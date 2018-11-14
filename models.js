const schema = require('./schema.js');
const mongoose = require('mongoose');
const products = mongoose.model('product',schema.products);

const model = {
  products:products
}

module.exports = model;