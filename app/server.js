var express = require('express'),
    urlpaser = require('url')
       
server = module.exports = express.createServer();

// Configuration
server.configure(function(){
  server.set('views', __dirname + '/views');
  server.set('view engine', 'ejs');
  server.use(express.bodyParser());
  server.use(express.cookieParser());
  server.use(express.session({ secret: "crandlefon&p7q5linB0xfun" }));
  server.use(express.methodOverride());
  server.use(server.router);
  server.use(express.static(__dirname + '/public'));
  
  
});

server.configure('development', function(){
  server.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  process.env.type = 'development';
  server.basepath = "http://127.0.0.1:4000";
  server.facebook_basepath = "http://localhost:4000";
  server.facebook_appid = "249249625110424";
  
});

server.configure('production', function(){
  server.use(express.errorHandler()); 
  server.basepath = "http://mc-facebook-signup.herokuapp.com";
  server.facebook_basepath = server.basepath;
  server.facebook_appid = "165282016887983";
});

//after configuring server per environment, init objects accordingly
var controller = require('./controller');

// RouteReference
//  GET:    /  - login
//  GET:    /dashboard    - iframe code generated here once logged in
//  GET:    /connect     - oauth landing 
//  GET:    /fb-signup?  - naive <iframe src=
//  GET:    /button     - ajax API <iframe src=
//  POST:   /subscription     - ajax subscribe($.post)

server.get('/',controller.welcome.login);
server.get('/dashboard',controller.welcome.dashboard);
server.get('/connect',controller.oauth.connect);
server.get('/fb-signup?',controller.naive.show);
server.get('/button',controller.button.show);
server.post('/subscription',controller.subscription.create);




// Only listen on $ node server.js

if (!module.parent) {
var port = process.env.PORT || process.env.C9_PORT || 4000;
  server.listen(port);
  
  console.log("Express "+(process.env.type || '')+" server listening on port %d", server.address().port);
}