var Subscription = require('../models/subscription'),
	Logger = mongoose.model('LogEntry');

module.exports.create = function(req, response) {
    req.accepts('application/json');
    var subscription = new Subscription({
        list_id: req.body.id,
        user_id: req.body.u,
        email_address: req.body.email_address,
        merge_values: req.body.merge_values,
		opt_in: req.body.opt_in
    });
    subscription.create(function(result) {
        var body = JSON.stringify({
            result: result,
            email_address: subscription.email_address
        });
		Logger.registerSubscribe(req,function(){
			response.writeHead(200, {
	            'Content-Type': 'application/json; charset=utf-8',
	            'Content-Length': body.length
	        });
	        response.end(body);
		});
    });
};