var oauth = require('../../config/oauth'),
    User = require('../models/user'),
    List = require('../models/list');
module.exports.login = function(req, res) {
    if (typeof req.session.user != 'undefined') {
        res.redirect('/dashboard');
    }
    else {
        res.render('welcome/login', {
            login_url: oauth.getAuthorizeUrl({
                response_type: "code",
                redirect_uri: server.basepath + "/connect"
            })
        });
    }
};
module.exports.dashboard = function(req, res) {
    if (typeof req.session.user == 'undefined') {
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