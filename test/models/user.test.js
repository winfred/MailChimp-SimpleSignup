process.env.type = 'testing';
var should = require('should'),
    chimp = require('../../config/chimp'),
    User = require('../../app/models/user');
var testUser = require('./factory/user.factory').user_test;
var init = function(callback) {
        testUser().save(callback);
    };
//test count 7
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
            var user = new User({
                _id: testUser()._id
            });
            user.find_by_id(function(err) {
                should.not.exist(err);
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
        user.save(function(err) {
            user.remove(function(error) {
                should.not.exist(error);
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
        user.remove(function(err) {
            should.exist(err);
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
            user.lists.should.be.an.instanceof(Array);
            user.lists.length.should.be.above(0);
            user.lists[0].should.have.property("merge_vars");
            user.lists[0].should.have.property("name");
            user.lists[0].should.have.property("id");
            user.save(function() {
                user.lists.should.be.an.instanceof(Array);
                user.lists.length.should.be.above(0);
                user.lists[0].should.have.property("merge_vars");
                user.lists[0].should.have.property("name");
                user.lists[0].should.have.property("id");
                user.find_by_id(function() {
                    user.lists.should.be.an.instanceof(Array);
                    user.lists.length.should.be.above(0);
                    user.lists[0].should.have.property("merge_vars");
                    user.lists[0].should.have.property("name");
                    user.lists[0].should.have.property("id");
                    calls++;
                    console.log('finished: User#fetchListIDs');
                });
            })
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'save clears any temp values': function(beforeExit) {
        var calls = 0;
        var user = testUser({
            id: "Freddie",
            temp: {
                "this": "is",
                some: "temp",
                shit: "yo"
            }
        });
        user.save(function() {
            should.not.exist(user.temp);
            should.not.exist(user.api);
            user.find_by_id(function() {
                should.not.exist(user.temp);
                should.not.exist(user.api);
                calls++;
                console.log("finished: User#save clears any temp values");
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    }
};