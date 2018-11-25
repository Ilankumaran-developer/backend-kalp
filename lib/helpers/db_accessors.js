'use strict';
class Datahelper {
    constructor(models) {
        this.models = models
        this.saveData = this.saveData.bind(this);
        this.findData = this.findData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.findDataById = this.findDataById.bind(this);
        this.updateData = this.updateData.bind(this);
        this.findIn = this.findIn.bind(this);
    }
    async saveData(document, payload) {
        let models = this.models[document]
        let doc = new models(payload)
        doc.save((err, response) => {
            if (err) {
                return err;
            }
            else {
                return response
            }
        })
    }
    async findData(document, cb) {

        let models = this.models[document]
        models.find((err, response) => {
            if (cb) {
                if (err)
                    cb(err)
                else
                    cb(response)
            }
            else {

                if (err) {
                    return err
                }
                else {
                    return response
                }
            }

        })
    }
    async deleteData(document, options) {
        let models = this.models[document]
        models.findByIdAndRemove(options.id, (err, response) => {
            if (err) {
                return err
            }
            else {
                return response
            }
        })
    }
    async findDataById(document, options, cb) {
        let models = this.models[document]
        models.findById(options.id, (err, response) => {
            if (cb) {
                if (err)
                    cb(err)
                else
                    cb(response)
            }
            else {
                if (err) {
                    return err
                }
                else {
                    return response;
                }
            }
        })
    }
    async updateData(document, options) {
        let models = this.models[document]
        models.findOneAndUpdate(options.id, options.payload, { new: true }, (err, response) => {
            if (err) {
                return err
            }
            else {
                return response
            }
        })
    }
    async findIn(document, options, cb) {
        let models = this.models[document]
        models.find(options, (err, response) => {
            if (cb) {
                if (err)
                    cb(err)
                else
                    cb(response)
            }
            else {
                if (err) {
                    return err
                }
                else {
                    return response
                }
            }
        })
    }

}
module.exports = Datahelper