var oauth = require('../../config/oauth'),
    User = require('../models/user'),
    List = require('../models/list');
module.exports.login = function(req, res) {
    if (not_logged_in(req)) {
		res.render('welcome/login', {
            login_url: loginUrl()
        });
    }
    else {
        res.redirect('/dashboard');
    }
};
module.exports.dashboard = function(req, res) {
    if (not_logged_in(req)) {
        res.redirect('/');
    }
    else {
        var user = req.session.user;
        //user.find_by_id(function(err) {
            for (var i=0;i<user.lists.length;i++){
             var list = user.lists[i];
             user.lists[i] = new List(list);
             user.lists[i].testCompatibility();   
            }    
            res.render('welcome/dashboard', {
                lists: user.lists,
                user_id: user._id
            });
        //});
    }

};
module.exports.faq = function(req,res){
	var login_url;
	if (not_logged_in(req)) {
        var login_url = loginUrl();
	}
    res.render('welcome/faq',{
		login_url: login_url
	});
    
};
module.exports.logout = function(req,res){
    delete req.session.user;
    res.redirect('/');
    
};
//helpers and sugar
var loginUrl = function(){
	return oauth.getAuthorizeUrl({
        response_type: "code",
        redirect_uri: server.basepath + "/connect"
    });
}
var not_logged_in = function(req){
	return (typeof req.session.user == 'undefined');
}
