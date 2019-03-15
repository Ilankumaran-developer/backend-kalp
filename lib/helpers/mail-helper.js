const mailHelper = {};
const nodemailer = require('nodemailer');
const _ = require('lodash');
mailHelper.createTransporter = function(config) {
    let transporterData = {};
    transporterData.service = _.get(config, 'service');
    transporterData.auth = {};
    transporterData.auth.user = _.get(config, 'username');
    transporterData.auth.pass = _.get(config, 'password');
    const transporter = nodemailer.createTransport(transporterData);
    return transporter;
}

module.exports = mailHelper;