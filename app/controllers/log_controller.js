require('../models/log');
var Logger = mongoose.model('LogEntry');
module.exports.index = function(req,res){
	if (not_admin(req.session.user)){
		res.redirect('/');
	}else{
		Logger.find(function(err,docs){
			res.render('log/index',{
				logs: docs 
			});	
		});
	}
};
function not_admin(user){
	//super simple admin check for my user_id
	return typeof user == 'undefined' || user._id != "5f96e5e279c0586e9576c5d88";
};