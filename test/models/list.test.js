process.env.type = 'testing';
var should = require('should'),
    testList = require('./factory/list.factory').list_test,
    List = require('../../app/models/list');
    testUser = require('./factory/user.factory').subscription_test;
//test count 2
module.exports = {
    'fetchMergeVars': function(beforeExit) {
        var calls = 0;
        var list = testList;
        testUser.temp = {};
        testUser.lists = [list];
        testUser.temp.calls = 0;
        list.fetchMergeVars(testUser,beforeExit,function() {
            should.exist(list.merge_vars);
            list.merge_vars.should.be.an.instanceof(Array);
            list.merge_vars.length.should.be.above(0);
            list.merge_vars[0].should.have.property("field_type");
            calls++;
            console.log("finished: List#fetchMergeVars");
        });
        beforeExit(function() {
            calls.should.eql(1);
        });
    },
    'testCompatibility compatible list': function() {
        
        var list = new List({
            merge_vars: [{
                name: 'Email Address',
                req: true,
                field_type: 'email',
                'public': true,
                show: true,
                order: '1',
                'default': null,
                helptext: null,
                size: '25',
                tag: 'EMAIL'
            }, {
                name: 'First Name',
                req: false,
                field_type: 'text',
                'public': true,
                show: true,
                order: '2',
                'default': '',
                helptext: '',
                size: '25',
                tag: 'FNAME'
            }, {
                name: 'Last Name',
                req: false,
                field_type: 'text',
                'public': true,
                show: true,
                order: '3',
                'default': '',
                helptext: '',
                size: '25',
                tag: 'LNAME'
            }]
        });
        list.testCompatibility().should.be.an.instanceof(Array);
        console.log("finished: List#testCompatibility compatible list");
        
    },
    'testCompatibility compatible list': function() {
      
        var list = new List({
            merge_vars: [{
                name: 'Email Address',
                req: true,
                field_type: 'email',
                'public': true,
                show: true,
                order: '1',
                'default': null,
                helptext: null,
                size: '25',
                tag: 'EMAIL'
            }, {
                name: 'First Name',
                req: false,
                field_type: 'text',
                'public': true,
                show: true,
                order: '2',
                'default': '',
                helptext: '',
                size: '25',
                tag: 'FNAME'
            }, {
                name: 'POO',
                req: true,
                field_type: 'text',
                'public': true,
                show: true,
                order: '3',
                'default': '',
                helptext: '',
                size: '25',
                tag: 'POO'
            }]
        });
        list.testCompatibility().should.not.be.empty;
        list.testCompatibility().length.should.eql(1);
        console.log("finished: List#testCompatibility incompatible list report format");
    }
};