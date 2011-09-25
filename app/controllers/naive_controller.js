module.exports.show = function(req,res){
    
  res.render('naive/show',{
      signup_url: req.query.url,
      user_id: req.query.u,
      list_id: req.query.id,
      signup_prompt: req.query.signup_prompt
   });  
};