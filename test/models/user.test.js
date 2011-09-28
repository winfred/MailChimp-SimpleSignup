process.env.type = 'testing';
var should = require('should'),
    chimp = require('../../config/chimp'),
    User = require('../../app/models/user');
var testUser = require('./factory/user').user_test;
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
            should.exist(user.lists);
            should.exist(user.lists.total);
            user.lists.total.should.be.above(0);
            should.exist(user.lists.data);
            for(var list in user.lists.data){
                should.exist(user.lists.data[list].name);
            }
            
            calls++;
            console.log('finished: User#fetchListIDs');
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'fetchListMergeVars without lists': function(beforeExit) {
        var calls = 0;
        var user = testUser();
        user.fetchListMergeVars(function() {
            should.exist(user.lists);
            calls++;
            console.log("finished: User#fetchMergeVars without lists");
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'fetchListMergeVars with lists already': function(beforeExit) {
        var calls = 0;
        var user = testUser();
        user.fetchLists(function() {
            user.fetchListMergeVars(function() {
                for (var list in user.lists.data) {
                    should.exist(user.lists.data[list].merge_vars);
                }
                user.save(function(){
                    calls++;
                console.log("finished: User#fetchListMergeVars with lists already");
                });
                
                
            });
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'save clears any temp values': function(beforeExit){
        var calls = 0;
        var user = testUser({id: "Freddie", temp: {"this": "is", some: "temp", shit: "yo"}});
        user.save(function(){
            should.not.exist(user.temp);
            should.not.exist(user.api);
            user.find_by_id(function(){
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