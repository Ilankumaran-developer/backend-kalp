module.exports = function(mod)
{
var router = {};
router.save = function(req,res)
{
    console.log(req.body)
    let payload = req.body;
    payload.date_created = new Date();
const products = new mod.products(payload);
products.save(function(err,response){
  
  res.send(response)
});

}

router.show = function(req,res)
{
   mod.products.find((err,response)=>{
    
    res.send(response)
  })

}

return router;
}