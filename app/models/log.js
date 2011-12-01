var url = require('url');
/**
 * Some simple logging with MongoDB/Mongoose
 * Mongoose connection and global set up in server.js
 * I reckon requests shouldn't be passed to models.
 * These request handling methods should maybe be moved into the log_controller
 * and perhaps logevents should be triggered by the browser through another ajax request
 */
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var LogEntrySchema = new Schema({
    _id        : ObjectId
  , env       : String
  , user	  : String
  , subscribes: {type: Number, default: 0}
  , loads 	  : {type: Number, default: 1}
  , website   : String
});
/**
 * Static helper methods
 */
//monkeypatch create method
LogEntrySchema.statics.create = function(options,cb) {
	var LogEntry=  mongoose.model('LogEntry'),
	    log = {};
   	for (var key in options){
		log[key] = options[key];
	}
	var logEntry = new LogEntry(log);
	logEntry.save(cb);
};
LogEntrySchema.statics.registerLoad = function(req,cb){
	this.findUserWebsiteDoc(req,cb,function(doc){
		if(doc){
			doc.incrementLoads(cb);
		}else{
			buildProfileDoc(req,cb);
		}
	});
}
LogEntrySchema.statics.registerSubscribe = function(req,cb){
	this.findUserWebsiteDoc(req,cb,function(doc){
		if (doc){
			doc.incrementSubscribes(cb);
		}else{
			console.log("building log profile upon first subscribe... if in a production environment, this profile should have been built upon the button being loaded rather than here. Check the log model for more details.")
			//this should only ever run in a dev enironment as it compensates for the localhost/127.0.0.1 conundrum
			buildProfileDoc(req,cb); 
		}	
	});
}
LogEntrySchema.statics.findUserWebsiteDoc = function(req,orig_cb,cb){
	this.findOne({user: req.query.u, website: referringHost(req)},function(err,doc){
		console.log(doc);
		if (err) {
			console.log("error connecting to database with request from "+req.headers.referer)
			//fail out
			orig_cb();
		} else {cb(doc);}
	});
}
/**
 * Instance methods
 */
LogEntrySchema.methods.incrementSubscribes = function (cb) {
   	this.subscribes++;
	this.save(cb);
};
LogEntrySchema.methods.incrementLoads = function(cb) {
   	this.loads++;
	this.save(cb);
};
/**
 * Private Helpers
 */
function referringHost(req){
	return url.parse(req.headers.referer).hostname;
}
function buildProfileDoc(req,cb){
	mongoose.model('LogEntry').create({
		env: process.env.type,
		user: req.query.u || req.body.u,
		website: referringHost(req),
	},cb);
}
mongoose.model("LogEntry", LogEntrySchema);
