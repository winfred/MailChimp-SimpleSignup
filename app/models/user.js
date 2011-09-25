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
            callback(err, null);
        }
        else {
            callback(err, new User(doc));
        }
    });
};
User.prototype.save = function(callback) {
    var user = this;
    db.save(user._id, user, function(err, doc) {
        callback(err, new User(doc));
    });
};
User.prototype.remove = function(callback) {
    var user = this;
    db.get(user._id, function(err, doc) {
        if (err) {
            callback(err, null);
        }
        else {
            db.remove(doc._id, doc._rev, function(error, res) {
                callback(error, res);
            });
        }
    });
};

/**
 * MailChimp data-population methods
 */
User.prototype.fetchLists = function(callback) {
    var user = this;
    user.API().lists({
        start: 0,
        limit: 100
    }, function(lists) {
        if (lists.error) console.log('Error: ' + lists.error + ' (' + lists.code + ')');
        else {
            var u_lists = {};
            for (var i = 0; i < lists.total; i++) {
                u_lists[lists.data[i].id] = lists.data[i].name;
            }
            
            user.lists = u_lists;
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
User.prototype.API = function() {
    return new chimp(this.apikey, {
        version: '1.3',
        secure: false
    });
};
//export model
module.exports = User;
