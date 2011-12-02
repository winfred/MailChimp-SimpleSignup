module.exports.mongoose = require('mongoose');
module.exports.server = require('./server');
require('./models/log');
var Log = mongoose.model('LogEntry');
module.exports.Log = Log;
module.exports.findAll = function(cb){
	Log.find({},function(err,docs){
		console.log(docs);
		cb ? cb(docs) : '';
	})
};
module.exports.removeAll = function(cb){
	Log.remove({},function(err,docs){
		console.log(docs);
		cb ? cb(docs) : '';
	})
};