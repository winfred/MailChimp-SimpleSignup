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
        for (var key in properties) {
          
            this[key] = properties[key];
          
        }
        build_child_objects(this);
    };
/**
 * inflates UserDoc child objects with properties from DB
 */

function build_child_objects(user) {
    //child documents can be instantiated as seen below
    if (user.lists){
        for (var i=0;i<user.lists.length;i++) {
            var list = user.lists[i];
            //pretty sure the list var is unecessary - need to research my JS
            user.lists[i] = new List(list);
        }
    }
      
}
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
        
            build_child_objects(user);
            
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
        user = new User(doc);
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
                if (error) {
                    callback(error);
                }
                else {
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
//Grab all relevant list data
User.prototype.fetchLists = function(callback) {
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
                user.lists[j].fetchMergeVars(user,finishFetchListsAsync,callback);
            }
        }
    });
};
//finishes the async process
function finishFetchListsAsync(user,callback) {
    if (user.lists.length == user.temp.calls) {
        callback();
    }
}
User.prototype.fetchUserID = function(callback) {
    var user = this;
    user.API().getAccountDetails(function(accountDetails) {
        user._id = accountDetails.user_id;
        callback();
    });
};
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
//export model
module.exports = User;