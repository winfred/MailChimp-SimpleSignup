/**
 * Set up MailChimp user accounts for each async test being run 
 * so operations don't collide
 */
var User = require('../../../app/models/user');
module.exports.user_test = function(props) {
    var properties = props || {};
    properties._id = properties._id || 'Some UserID';
    properties.apikey = properties.apikey || 'That users API key';
    return new User(properties);
};
module.exports.subscription_test = new User({
    //this is my testing account
    _id: 'Some other ID',
    apikey: 'some others APIkey'
});