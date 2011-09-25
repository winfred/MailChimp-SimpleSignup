var should = require('should'),
    server = require('../../app/server');
process.env.type = "testing";
module.exports = {
    "welcome#index displays mailchimp login url": function(beforeExit) {
        var calls = 0;
        should.response(server, {
            url: '/',
            method: 'GET'
        }, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        }, function(res) {
            res.body.should.include.string('Log in with your MailChimp account');
            res.body.should.include.string('mailchimp.com');
            ++calls;
            console.log("finished: 'welcome#index shows login url'");
        });
        beforeExit(function() {
            should.eql(1, calls);
        });
    }/*,
    "welcome#show displays list information": function(beforeExit) {
        
        TODO: oauth landing
        var calls = 0;
        should.response(server, {
            url: '/account',
            method: 'GET'
        }, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        }, function(res) {
            res.body.should.include.string('Login with your MailChimp account');
            res.body.should.include.string('mailchimp.com');
            ++calls;
            console.log("finished: 'welcome#index shows login url'");
        });
        beforeExit(function() {
            should.eql(1, calls);
        });
      
    }  */
}