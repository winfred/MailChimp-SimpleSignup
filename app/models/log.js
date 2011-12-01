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
  , user	  : String
  , clicks    : {type: Number, default: 0}
  , views 	  : {type: Number, default: 1}
  , website   : String
  , list      : String
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
LogEntrySchema.statics.registerView = function(req,cb){
	this.findUserWebsiteDoc(req,cb,function(doc){
		if(doc){
			doc.incrementViews(cb);
		}else{
			buildProfileDoc(req,cb);
		}
	});
}
LogEntrySchema.statics.registerClick = function(req,cb){
	this.findUserWebsiteDoc(req,cb,function(doc){
		if (doc){
			doc.incrementClicks(cb);
		}else{
			console.log("building log profile upon first subscribe... if in a production environment, this profile should have been built upon the button being loaded rather than here. Check the log model for more details.")
			//this should only ever run in a dev enironment as it compensates for the localhost/127.0.0.1 conundrum
			buildProfileDoc(req,cb); 
		}	
	});
}
LogEntrySchema.statics.findUserWebsiteDoc = function(req,orig_cb,cb){
	this.findOne(profile_from(req),function(err,doc){
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
LogEntrySchema.methods.incrementClicks = function (cb) {
   	this.clicks++;
	this.save(cb);
};
LogEntrySchema.methods.incrementViews = function(cb) {
   	this.views++;
	this.save(cb);
};
/**
 * Private Helpers
 */
function referringHost(req){
	return url.parse(req.headers.referer).hostname;
}
function buildProfileDoc(req,cb){
	if (referringHost(req) != 'mailchimp-simplesignup.com' || referringHost(req) != 'mailchimp-simplesignup.herokuapp.com') {
		mongoose.model('LogEntry').create(profile_from(req),cb);
	}
}
function profile_from(req){
	return {user: req.query.u || req.body.u, 
		website: referringHost(req),
		list: req.query.id || req.body.id
		};
}
mongoose.model("LogEntry", LogEntrySchema);
