var oauth = require('../../config/oauth');
module.exports.login = function(req,res){
    if (typeof req.session.user != 'undefined'){
        res.redirect('/dashboard');
    }else{
      res.render('welcome/login',{
      login_url: oauth.getAuthorizeUrl({response_type: "code", redirect_uri: server.basepath+"/connect"})
      });  
    }
  
      
      
};
module.exports.dashboard = function(req,res){
    if (typeof req.session.user == 'undefined'){
        res.redirect('/');
    }else{
      res.render('welcome/dashboard',{
        user: req.session.user
      });  
    }
    
};