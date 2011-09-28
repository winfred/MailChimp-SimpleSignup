process.env.type = 'testing';
var should = require('should'),
    Subscription = require('../../app/models/subscription');
    
//TODO: move tetSubscription logic to factory
var testSubscription = function(props) {
        var properties = props || {};
        var list_id = properties.list_id || '586cafbf72',
            user_id = properties.user_id || '5f96e5e279c0586e9576c5d88',
            email_address = properties.email_address || 'emailtesting@mailchimp.com',
            merge_values = {
                MERGE1: 'Freddie',
                MERGE2: 'Chimpenheimer'
            };
        return new Subscription({
            list_id: list_id,
            user_id: user_id,
            email_address: email_address,
            merge_values: merge_values
        });
    };
var testUser = require('./factory/user').subscription_test;
    
var start = function(callback) {
        testUser.save(callback);
    };
//test count is 4
module.exports = {
    'create duplicate/already subbed': function(beforeExit) {
        var calls = 0;
        start(function() {
            var subscription = testSubscription();
            subscription.create(function(res) {
                //try again
                subscription.create(function(res) {
                    //should throw an already subbed code
                    res.code.should.eql('214');
                    console.log('finished: Subscription#create duplicate address');
                    //now reset here since it doesn't work in beforeExit
                    testUser.API().listUnsubscribe({
                        id: subscription.list_id,
                        email_address: subscription.email_address,
                        delete_member: true
                    }, function() {
                        //console.log('removed test Subscription: ' + subscription.email_address);
                        calls++;
                    });
                });
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'create/subscribe fresh': function(beforeExit) {
        var calls = 0;
        start(function() {
            var subscription = testSubscription({
                email_address: 'examples@mailchimp.com'
            });
            subscription.create(function(res) {
                res.should.be.true;
                console.log('finished: Subscription#create fresh address');
                //now reset here since it doesn't work in beforeExit
                testUser.API().listUnsubscribe({
                    id: subscription.list_id,
                    email_address: subscription.email_address,
                    delete_member: true
                }, function() {
                    //console.log('removed test Subscription: ' + subscription.email_address);
                    calls++;
                });
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'create false list': function(beforeExit) {
        var calls = 0;
        start(function() {
            testSubscription({
                list_id: 'OHYEAH'
            }).create(function(res) {
                //should throw an appropriate MCapi-style error
                res.error.should.exist;
                res.code.should.exist;
                res.code.should.eql(200);
                calls++;
                console.log('finished: Subscription#create false list');
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'create false user': function(beforeExit) {
        var calls = 0;
        start(function() {
            testSubscription({
                user_id: 'OHYEAH'
            }).create(function(res) {
                //should throw an appropriate MCapi-style error
                res.error.should.exist;
                res.code.should.exist;
                res.code.should.eql(100);
                calls++;
                console.log('finished: Subscription#create false user');
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    }
};