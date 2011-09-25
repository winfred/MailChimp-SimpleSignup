var should = require('should'),
    server = require('../../app/server');
process.env.type = "testing";
module.exports = {
    'JSON POST with formatted response': function(beforeExit) {
        var calls = 0;
        should.response(server, {
            url: '/subscription',
            method: 'POST',
            data: JSON.stringify({
                //TODO: factorify these values
                u: 'cbc5a1d23fd6138ca74f1aef6',
                id: '23f0aa7a06',
                email_address: 'emailtesting@mailchimp.com',
                merge_tags: {
                    MERGE1: 'Freddie',
                    MERGE2: 'Chimpenheimer'
                }
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }, function(res) {
            var body = JSON.parse(res.body);
            body.should.have.property('result');
            if (body.result.error) {
                body.result.should.have.property('error');
                body.result.should.have.property('code');
            }
            body.should.have.property('email_address', "emailtesting@mailchimp.com");
            calls++;
            console.log("finished: 'JSON subscribe response formatting'");
        });
        beforeExit(function() {
            should.eql(1, calls);
        });
    }
    //TODO: the edge cases
}