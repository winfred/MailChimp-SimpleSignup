//using the same factory that was used for the subscription test until I find a good reason for another account/factory-user
var testUser = require('./user.factory').subscription_test,
    List = require('../../../app/models/list');
    
module.exports.list_test = new List({
    user: testUser(),
    id: 'some-listID-for-the-SubscriptionTest-account',
    name: 'the-name-of-that-list'
});