module.exports.show = function(req,res){
   res.render('button/show',{
       layout: false,
      user_id: req.query.u,
      list_id: req.query.id,
      signup_prompt: req.query.signup_prompt
   }); 
};

