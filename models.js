const schema = require('./schema.js');
const mongoose = require('mongoose');
const products = mongoose.model('product',schema.products);
const transactions = mongoose.model('transactions',schema.transactions);
const mailer = mongoose.model('mailer',schema.mailer);

const model = {
  products:products,
  transactions:transactions,
  mailer: mailer
}

module.exports = model;