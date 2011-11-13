module.exports.show = function(req,res){
   res.render('button/show',{
       layout: false,
		options: req.query
   }); 
};

