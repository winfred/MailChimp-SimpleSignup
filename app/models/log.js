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

var Snapshots = new Schema({
	 date		: Date
	, clicks    : {type: Number, default: 0}
	, views 	  : {type: Number, default: 1}
});
var LogEntrySchema = new Schema({
    _id        : ObjectId
  , user	  : String
  , clicks    : {type: Number, default: 0}
  , views 	  : {type: Number, default: 1}
  , website   : String
  , list      : String
  , snapshots : [Snapshots]
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
	logEntry.snapshots.push({clicks: 0, views: 1, date: Date()});
};
LogEntrySchema.statics.registerView = function(req,cb){
	this.findUserListDoc(req,cb,function(doc){
		if(doc){
			/* Silencing snapshots for now - leaving code in place for reporting/analytics feature down the line
			//take snapshot if it has been a day since the last view
			var d = new Date(doc.snapshots.slice(-1)[0].date);
			if (((new Date().getTime()) - 86400000) > d.getTime()){
				doc.takeSnapshot(function(){
					doc.incrementViews(cb);
				});
			}else { }*/
			 doc.incrementViews(referringHost(req),cb);
		}else{
			buildProfileDoc(req,cb);
		}
	});
}
//Currently, this will only ever register a click on the mailchimp-simplesignup.com profile.
LogEntrySchema.statics.registerClick = function(req,cb){
	this.findUserListDoc(req,cb,function(doc){
		if (doc){
			doc.incrementClicks(cb);
		}else{
			console.log("building log profile upon first subscribe... if in a production environment, this profile should have been built upon the button being loaded rather than here. Check the log model for more details.")
			//this should only ever run in a dev enironment as it compensates for the localhost/127.0.0.1 conundrum
			buildProfileDoc(cb); 
		}	
	});
}
LogEntrySchema.statics.findUserListDoc = function(req,orig_cb,cb){
	this.findOne({user: req.query.u || req.body.u, list: req.query.id || req.body.id},function(err,doc){
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
LogEntrySchema.methods.incrementViews = function(referer,cb) {
   	this.views++;
	//temporary call to vaguely scoped website for internal tracking only 
	// website will be moved out of here as part of the unique profile identifier once i can pass a referer parameter through the iframe src and generate legit reports for users
	//as such, the website will be overwritten with the most reset request each time 
	//once again, I just want to have this data while building out more features
	this.website = referer;
	this.save(cb);
};
LogEntrySchema.methods.takeSnapshot = function(cb){
	this.snapshots.push({
		clicks: this.clicks,
		views: this.views,
		date: Date()
	});
	this.save();
	cb ? cb() : '';
}
/**
 * Private Helpers
 */
function referringHost(req){
	return url.parse(req.headers.referer).hostname;
}
function buildProfileDoc(req,cb){
	//let's not generate log entries for all of the button previews in production
	//staging and dev environments will be flooded by previews, although not really that hard to deal with
	if (referringHost(req) != 'mailchimp-simplesignup.com') {
		mongoose.model('LogEntry').create(profile_from(req),cb);
	}else{
		cb();
	}
}
function profile_from(req){
	return {user: req.query.u || req.body.u, 
		website: referringHost(req),
		list: req.query.id || req.body.id
		};
}
mongoose.model("LogEntry", LogEntrySchema);
