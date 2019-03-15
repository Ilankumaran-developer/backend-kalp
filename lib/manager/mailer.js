'use strict';
const DBhelper = require('../helpers/db_accessors.js'),
Helper = require('../helpers/helpers.js'),
 _ = require('lodash');

class MailerManager extends DBhelper {
    constructor(models){
        super(models)
        this.models = models;
        this.sendEmail = this.sendEmail.bind(this);
    }
    async sendEmail(){
        let me = this;
        try{

        }catch(e){
            
        }
    }
}