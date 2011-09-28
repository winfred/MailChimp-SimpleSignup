var db = require('../../config/database').db,
    chimp = require('../../config/chimp');
/** 
 * User in-memory model is a 1:1 match to Couch document that is enforced here.
 * Essentially functions are attached to the document this way
 * Necessary properties:
 * list_ids: list ids since last login
 * _id: MC unique user id == Couch doc _id
 * apikey: completed Oauth handshake token
 */
var User = function(properties) {
        for (var key in properties) {
            this[key] = properties[key];
        }
    };
/**
 * Sugary DB methods
 */
User.prototype.find_by_id = function(callback) {
    var user = this;
    db.get(user._id, function(err, doc) {
        if (err) {
            callback(err);
        }
        else {
            for (var key in doc) {
            user[key] = doc[key];
            }
            callback(null);
        }
    });
};
User.prototype.save = function(callback) {
    var user = this;
    //remove any temp data stored here
    delete user.temp;
    delete user.api;
    db.save(user._id, user, function(err, doc) {
        for (var key in doc) {
            user[key] = doc[key];
        }
        callback(err);
    });
};
User.prototype.remove = function(callback) {
    var user = this;
    //this call is likely useless now that _rev is brought into the user object
    db.get(user._id, function(err, doc) {
        if (err) {
            callback(err);
        }
        else {
            //will we ever have user objects without a _rev? If we won't, no need for the first get
            db.remove(doc._id, doc._rev, function(error, res) {
                if(error){
                    callback(error);   
                }else{
                callback(null);
                }
            });
        }
    });
};
/**
 *   )
 *   (
 * c[_]
 * 
 * MailChimp data-population methods
 * All list/user data fetching methods are found below
 */
User.prototype.fetchLists = function(callback) {
    var user = this;
    user.API().lists({
        start: 0,
        limit: 100
    }, function(lists) {
        if (lists.error) console.log('Error: ' + lists.error + ' (' + lists.code + ')');
        else {
            var lists_hash = {
                total: lists.total,
                data: {}
            };
            for (var i = 0; i < lists.total; i++) {
                lists_hash.data[lists.data[i].id] = {
                    name: lists.data[i].name
                };
            }
            user.lists = lists_hash;
            callback();
        }
    });
};
User.prototype.fetchUserID = function(callback) {
    var user = this;
    user.API().getAccountDetails(function(accountDetails) {
        user._id = accountDetails.user_id;
        callback();
    });
};

/**
 * design note: fetch-append-finish can be cleaner... perhaps an abstraction is needed. 
 * ------------------------------------------------------------------------
 */
//the fetch isn't actually made in this method, which is unclear... perhaps there's a better name for this process
User.prototype.fetchListMergeVars = function(callback) {
    var user = this;
    if (typeof user.lists == 'undefined') {
        user.fetchLists(function() {
            user.fetchListMergeVars(callback);
        });
        if (process.env.type != 'testing') {
            console.log("Warning: merge vars fetched before lists... you're covered this time but it is unadvised.");
        }
        return false;
    }
    //temp var for tracking when async calls are finished...
    //perhaps this should be apart of the async fetch abstraction?
    user.temp = user.temp || {};
    user.temp.calls = 0;
    for (var list in user.lists.data) {
        user.appendListMergeVars(list, callback);
    }
};
User.prototype.appendListMergeVars = function(list, callback) {
    var user = this;
    user.API().listMergeVars({
        id: list
    }, function(merge_vars) {
        user.lists.data[list].merge_vars = merge_vars;
        user.temp.calls++;
        user.finishListMergeVars(callback);
    });
};
User.prototype.finishListMergeVars = function(callback) {
    if (this.lists.total == this.temp.calls) {
        callback();
    }
};
/**
 * --------------------the above three methods smell funny -------------------
 */
User.prototype.API = function() {
    if (typeof this.apikey == 'undefined') {
        console.log('User must have apikey before setting its API object');
        return null;
    }
    else {
        this.api = this.api || new chimp(this.apikey, {
            version: '1.3',
            secure: false
        });
        return this.api;
    }
};
/**
 * The List Compliance section:
 * Do the list merge vars fit with the data availalbe in Facebook?
 * Let's find out!
 * 
 * For starters, let's support Email/FName/LName
 * 
 */
 User.prototype.facebookCompliance = function(callback){
     if (typeof this.lists == 'undefined'){
        this.complianceFacebook = false;
     }else if(typeof this.lists.merge_vars == 'undefined'){
        this.complianceFacebook = false;   
     }else{
         //TODO: generate report for each list
         // incompatible if one of the following is met (for now...)
         // *anything other than email/fname/lname is required
         // *Fname And Lname are one merge var
        
         
        
         
     }
     
 }
 
 
//export model
module.exports = User;