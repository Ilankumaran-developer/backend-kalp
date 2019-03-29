'use strict';
class Datahelper {
    constructor(models) {
        this.models = models
        this.saveData = this.saveData.bind(this);
        this.findData = this.findData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.findDataById = this.findDataById.bind(this);
        this.updateData = this.updateData.bind(this);
        this.truncateModel = this.truncateModel.bind(this);
        this.findIn = this.findIn.bind(this);
    }
    async saveData(document, payload) {
        return new Promise((resolve, reject) => {
            let models = this.models[document]
            let doc = new models(payload)
            doc.save((err, response) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(response)
                }
            })
        })
    }
    async findData(document, options = {}) {
        return new Promise((resolve, reject) => {
            let models = this.models[document];
            try {
                models.find(options,(err, response) => {

                    if (err) {
                        reject(err)
                    }
                    else {
                        //console.log('hitttttttt', response)
                        resolve(response);
                    }
                })
            } catch (e) {
                reject(e);
            }
        })

    }
    async deleteData(document, options) {

        return new Promise((resolve, reject) => {
            try {
                let models = this.models[document]
                models.findByIdAndRemove(options.id, (err, response) => {
                  
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                })
            } catch (e) {
                
                reject(e);
            }

        })

    }
    async truncateModel(document, options){
        return new Promise((resolve, reject) => {
            try {
                let me = this;
                let models = me.models[document]
                models.remove({}, (err, response) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(response);
                    }

                })
            } catch (e) {
                reject(e);
            }

        })
    }
    async findDataById(document, options) {
        return new Promise((resolve, reject) => {
            try {
                let me = this;
                let models = me.models[document]
                models.findById(options.id, (err, response) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(response);
                    }

                })
            } catch (e) {
                reject(e);
            }

        })
    }
    async updateData(document, options) {
        return new Promise((resolve, reject) => {
            try {
                let me = this;
                let models = me.models[document]
                models.findOneAndUpdate(options.id, options.payload, { new: true }, (err, response) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(response);
                    }
                })
            } catch (e) {
                reject(e);
            }

        })

    }
    async findIn(document, options) {
        console.log(document, options)
        return new Promise((resolve,reject)=>{
            try{
                let models = this.models[document]
            models.find(options, (err, response) => {
                console.log('response', err , response)
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                
            })
            }catch(e){
                console.log(e)
                reject(e);
            }
            
        })
       
    }

}
module.exports = Datahelper