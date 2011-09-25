var should = require('should'),
    server = require('../app/server');

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
  },
  'JSON subscribe POST with proper responses': function(beforeExit){
    var calls = 0;
    
    should.response(server,{
      url: '/subscription',
      method: 'POST',
      data: JSON.stringify({u:'cbc5a1d23fd6138ca74f1aef6', id:'23f0aa7a06',email_address: 'winfred.nadeau@gmail.com',merge_tags: {MERGE1: 'Winfred', MERGE2: 'Nadeau'}}),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    },{
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }  
    }, function(res){
        var body = JSON.parse(res.body);
       body.should.have.property('result');
       if (body.result.error){
            body.result.should.have.property('error');
            body.result.should.have.property('code');
            
       }
       body.should.have.property('email_address',"winfred.nadeau@gmail.com");
       calls++;
       console.log("finished: 'JSON subscribe response formatting'");
    });
    
    beforeExit(function(){
      should.eql(1, calls);
    });
  }  /*,

  'an already subscribed email subscribes': function(beforeExit){
    var calls = 0;
    
    should.response(server,{
      url: '/fb-ajax',
      method: 'POST',
      data: JSON.stringify({u:'cbc5a1d23fd6138ca74f1aef6', id:'23f0aa7a06',MERGE0: 'winfred.nadeau@gmail.com', MERGE1: 'Winfred', MERGE2: 'Nadeau'})
    },{
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf8'
      }  
    }, function(res){
       should.isNull(JSON.parse(res.body).error);
       should.include(JSON.parse(res.body).email, "win.nadeau@gmail.com");
    });
    
    beforeExit(function(){
      should.equal(1, calls);
    });
  }
  */
  
  
  
    
};