module.exports = function (mod) {
  var router = {};
  router.save = function (req, res) {
    console.log(req.body)
    let payload = req.body;
    payload.date_created = new Date();
    let profit = parseInt(req.body.selling_price) - parseInt(req.body.cost_price)
    let profit_percentage = parseInt(profit) / parseInt(req.body.cost_price) * 100;
    payload.profit = profit_percentage
    console.log(payload);
    const products = new mod.products(payload);
    products.save(function (err, response) {

      res.send(response)
    });

  }

  router.show = function (req, res) {
    mod.products.find((err, response) => {

      res.send(response)
    })

  }
  router.deleteProduct = (req, res) => {
    mod.products.findByIdAndRemove(req.body._id, (err, resp) => {
      if (!err) {
        mod.products.find((err, response) => {
        res.send({
          message: "Deleted Successfully",
          status: 1,
          products:response
        })
      })
      }
    })
  }

  router.showbyid = (req,res) =>{
    mod.products.findById(req.body.id,(err,response)=>{
      if(err)
      {
        res.send(err)
      }
      else{
        res.send(response)
      }
    })
  }
  router.updateProduct = (req,res) =>{
    let obj = {
      productname:req.body.productname,
      cost_price:req.body.cost_price,
      selling_price:req.body.selling_price,
      description: req.body.description
    }
    let profit = parseInt(req.body.selling_price) - parseInt(req.body.cost_price)
    let profit_percentage = parseInt(profit) / parseInt(req.body.cost_price) * 100;
    obj.profit = profit
    mod.products.findOneAndUpdate(req.body.id,obj,{new:true},(err,response)=>{
      if(err)
      {
        return err
      }
      else{
        return response;
      }
    })
  }

  return router;
}