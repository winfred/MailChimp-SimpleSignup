var Logger = mongoose.model('LogEntry');
module.exports.show = function(req,res){
	if (req.)
	Logger.registerView(req,function(){
		res.render('button/show',{
		       layout: false,
				options: req.query
		});
	});   
};


