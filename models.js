const schema = require('./lib/schema/kalpatharu/schema.js');
const mongoose = require('mongoose');
const products = mongoose.model('products',schema.products);
const transactions = mongoose.model('transactions',schema.transactions);
const mailer = mongoose.model('mailer',schema.mailer);

const model = {
  products:products,
  transactions:transactions,
  mailer: mailer
}

module.exports = model;