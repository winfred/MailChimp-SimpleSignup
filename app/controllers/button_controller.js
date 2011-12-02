var Logger = mongoose.model('LogEntry');
module.exports.show = function(req,res){
	req.query.host = req.headers.host;
	Logger.registerView(req,function(){
		res.render('button/show',{
		       layout: false,
				options: req.query
		});
	});   
};


