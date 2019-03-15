'use strict';
const DBhelper = require('../../helpers/db_accessors.js'),
Helper = require('../../helpers/helpers.js'),
 _ = require('lodash'),
 Mailer = require('../../helpers/mail-helper.js');

class MailerManager extends DBhelper {
    constructor(models, config){
        super(models)
        this.models = models;
        this.config = config;
        this.sendEmail = this.sendEmail.bind(this);
        this._buildOptions = this._buildOptions.bind(this);
        this._sendEmail = this._sendEmail.bind(this)
        this.modelName = 'mailer';
    }
    async sendEmail(){
        let me = this;
        try{
            let config = await me.findData(me.modelName);
            let transporter = Mailer.createTransporter(config[0]);
            let options  = me._buildOptions(config[0]);
            return await me._sendEmail(transporter, options);
        }catch(e){
        }
    }
    _buildOptions(config){
        let options = {};
        options.from = _.get(config, 'from');
        options.to = 'ilanthegrunt@gmail.com';
        options.subject = 'Testing';
        options.html = ''
        return options;
    }
    _sendEmail(sender, options){
        return new Promise(function(resolve,reject){
            try{
                sender.sendMail(options, function(err,info){
                    if(err)
                        reject(err)
                    else
                        resolve(info)
                })
            }catch(e){
                reject(e)
            }
        })

    }
}

module.exports = MailerManager;