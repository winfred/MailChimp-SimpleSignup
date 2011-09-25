/**
 * Set up MailChimp user accounts for each async test being run 
 * so operations don't collide
 * Replace userIDs and APIkeys here
 */

var User = require('../../../app/models/user');

//User test needs to be able to customize creation
moduel.exports.user_test = function(props) {
        var properties = props || {};
        var _id = properties._id || 'someUserID',
            apikey = properties.apikey || 'someAPIKey';
        return new User({
            _id: _id,
            apikey: apikey
        });
    };
//Subscription test just needs a user of some connected kind    
module.exports.subscription_test = new User({
            //this is a testing account
            _id: 'someOtherUserID',
            apikey: 'someOtherApiKey'
        });