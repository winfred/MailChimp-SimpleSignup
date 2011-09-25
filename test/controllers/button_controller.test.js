var should = require('should'),
    server = require('../../app/server');

process.env.type = "testing";
module.exports = {
  'iframe button loads': function(beforeExit){
    var calls = 0;

    should.response(server, {
      url: '/button?&u=cbc5a1d23fd6138ca74f1aef6&id=23f0aa7a06&signup_prompt=Newsletter%20Signup',
      method: 'GET'
    },{
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    }, function(res){
      res.body.should.include.string('mc-fb-signup');
      res.body.should.include.string('FB.init');
      res.body.should.include.string('<input type="hidden" name="u" value="cbc5a1d23fd6138ca74f1aef6" />'); 
      res.body.should.include.string('<input type="hidden" name="id" value="23f0aa7a06" />'); 
      res.body.should.include.string('Newsletter Signup');
      ++calls;
      console.log("finished: 'iframe button loads'");
    });
    
    
    beforeExit(function(){
        
      should.eql(1, calls);
    });
  }
  //TODO: edge cases & dynamic merge values
}