process.env.type = 'testing';
var should = require('should'),
    chimp = require('../../config/chimp'),
    User = require('../../app/models/user');
var testUser =  require('./factory/user').user_test(props);
    
var init = function(callback) {
        testUser().save(callback);
    };
//test count 6
module.exports = {
    'find_by_id does not exist': function(beforeExit) {
        var calls = 0;
        new User({
            _id: 'asdoijf'
        }).find_by_id(function(err, user) {
            err.error.should.eql("not_found");
            err.reason.should.eql("missing");
            should.not.exist(user);
            calls++;
            console.log('finished: User#find_by_id does not exist');
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'find_by_id does exist': function(beforeExit) {
        var calls = 0;
        init(function() {
            new User({
                _id: testUser()._id
            }).find_by_id(function(err, user) {
                should.not.exist(err);
                should.exist(user);
                user.should.be.an.instanceof(User);
                user._id.should.eql(testUser()._id);
                user.should.respondTo('API');
                calls++;
                console.log('finished: User#find_by_id does exist');
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'destroy existing': function(beforeExit) {
        var calls = 0;
        var user = testUser({
            '_id': 'this-will-be-saved-then-destroyed',
            apikey: 'asdfasdf'
        });
        user.save(function(err, usr) {
            user.remove(function(error, result) {
                should.not.exist(error);
                should.exist(result);
                result.ok.should.eql(true);
                calls++;
                console.log('finished: User#destroy existing');
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'destroy non-existent': function(beforeExit) {
        var calls = 0;
        var user = testUser({
            '_id': 'does-not-exist',
            apikey: 'asdfasdf'
        });
        user.remove(function(err, res) {
            should.exist(err);
            should.not.exist(res);
            err.reason.should.eql('missing');
            calls++;
            console.log('finished: User#destroy non-existent');
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'fetchUserID': function(beforeExit) {
        var calls = 0;
        var user = testUser({
            _id: 'blah'
        });
        user.fetchUserID(function() {
            should.exist(user._id);
            user._id.should.eql(testUser()._id);
            calls++;
            console.log('finished: User#fetchUserID');
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'fetchLists': function(beforeExit) {
        var calls = 0;
        var user = testUser();
        user.fetchLists(function() {
            should.exist(user.lists);
            user.lists.should.eql({
                //TODO: dynamically code testUser lists when introducing dynamic merge values
                '911502b12c': 'asdfadsf',
                '23f0aa7a06': 'Product Announcements'
            });
            calls++;
            console.log('finished: User#fetchListIDs');
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    }
};