var db = require('../../config/database').db,
    chimp = require('../../config/chimp'),
    List = require('./list');
/** 
 * User in-memory model is a 1:1 match to Couch document that is enforced here.
 * Essentially functions are attached to the document this way
 * Necessary properties:
 * list_ids: list ids since last login
 * _id: MC unique user id == Couch doc _id
 * apikey: completed Oauth handshake token
 */
var User = function(properties) {
        build_objects_from_document(this,properties);
    };
    
function build_objects_from_document(object,properties){
    for (var key in properties) {
        object[key] = properties[key];
    }
    build_child_objects(object);   
}


function build_child_objects(user) {
    //child documents can be instantiated as seen below
    if (user.lists){
        for (var i=0;i<user.lists.length;i++) {
            user.lists[i] = new List(user.lists[i]);
        }
    }
      
}
User.prototype = {
	/**
	 * Sugary DB methods
	 */
	find_by_id: function(callback) {
	    var user = this;
	    db.get(user._id, function(err, doc) {
	        if (err) {
	            callback(err);
	        }
	        else {
	            build_objects_from_document(user,doc);

	            callback(null);
	        }
	    });
	},
	save: function(callback) {
	    var user = this;
	    //remove any temp data stored here
	    delete user.temp;
	    delete user.api;

	    db.save(user._id, user, function(err, doc) {
	        build_objects_from_document(user,doc);
	        callback(err);
	    });
	},
	remove: function(callback) {
	    var user = this;
	    //this call is likely useless now that _rev is brought into the user object
	    db.get(user._id, function(err, doc) {
	        if (err) {
	            callback(err);
	        }
	        else {
	            //will we ever have user objects without a _rev? If we won't, no need for the first get
	            db.remove(doc._id, doc._rev, function(error, res) {
	                if (error) {
	                    callback(error);
	                }
	                else {
	                    callback(null);
	                }
	            });
	        }
	    });
	},
	/**
	 *    )
	 *   (
	 * c[_]
	 * 
	 * MailChimp data-population methods
	 * All list/user data fetching methods are found below
	 */
	//Grab all relevant list data
	fetchLists: function(callback) {
	    var user = this;
	    user.API().lists({
	        start: 0,
	        limit: 100
	    }, function(lists) {
	        if (lists.error) console.log('Error: ' + lists.error + ' (' + lists.code + ')');
	        else {
	            user.lists = [];
	            for (var i = 0; i < lists.total; i++) {
	                user.lists.push(new List({
	                    id: lists.data[i].id,
	                    name: lists.data[i].name
	                }));
	            }

	            user.temp = user.temp || {};
	            user.temp.calls = 0;
	            for (var j = 0; j < user.lists.length; j++) {
	                user.lists[j].fetchMergeVars(user,callback);
	            }
	        }
	    });
	},
	//finishes the async process
	finishFetchListsAsync: function(callback) {
	    if (this.lists.length == this.temp.calls) {
	        callback();
	    }
	},
	fetchUserID: function(callback) {
	    var user = this;
	    user.API().getAccountDetails(function(accountDetails) {
	        user._id = accountDetails.user_id;
	        callback();
	    });
	},
	API: function() {
	    if (typeof this.apikey == 'undefined') {
	        console.log('User must have apikey before setting its API object');
	        return null;
	    }
	    else {
	        this.api = this.api || new chimp(this.apikey, {
	            version: '1.3',
	            secure: false,
				userAgent: 'SimpleSignup'
	        });
	        return this.api;
	    }
	}
}


//export model
module.exports = User;