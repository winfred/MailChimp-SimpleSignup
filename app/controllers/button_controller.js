var Logger = mongoose.model('LogEntry');
module.exports.show = function(req,res){
	req.session.destroy(); //let's not keep this hanging around
	req.query.host = req.headers.host;
	Logger.registerView(req,function(){
		res.render('button/show',{
		       layout: false,
				options: req.query
		});
	});   
};


