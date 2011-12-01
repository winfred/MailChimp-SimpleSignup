var express = require('express'),
    urlpaser = require('url');
	mongoose = require('mongoose');       
server = module.exports = express.createServer();

//simple logging - make the connection and hook our model to mongoose
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/logs');
require('./models/log');

// Configuration
server.configure(function(){
  server.set('views', __dirname + '/views');
  server.set('view engine', 'ejs');
  server.use(express.bodyParser());
  server.use(express.cookieParser());
  server.use(express.session({ secret: "janglepop&p7q5linasfasd8uB0xfun" }));
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
server.configure('staging', function(){
  server.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  process.env.type = 'staging';
  server.basepath = "http://mailchimp-simplesignup-staging.herokuapp.com";
  server.facebook_basepath = server.basepath;
  server.facebook_appid = "247615681960473";
  
});
server.configure('production', function(){
  server.use(express.errorHandler()); 
  server.basepath = "http://mailchimp-simplesignup.com";
  server.facebook_basepath = server.basepath;
  server.facebook_appid = "165282016887983";
});
 
//after configuring server per environment, init objects accordingly
var controller = require('./controller');

// RouteReference
//  GET:    /  - login
//  GET:    /dashboard    - iframe code generated here once logged in
//  GET:    /connect     - oauth landing 
//  GET:    /fb-signup?  - legacy <iframe src=
//  GET:    /button     - ajax API <iframe src=
//  POST:   /subscription     - ajax subscribe($.post)

server.get('/',controller.welcome.login);
server.get('/dashboard',controller.welcome.dashboard);
server.get('/faq',controller.welcome.faq);
server.get('/logout',controller.welcome.logout);
server.get('/connect',controller.oauth.connect);
server.get('/fb-signup?',controller.naive.show);
server.get('/button',controller.button.show);
server.post('/subscription',controller.subscription.create);
server.get('/logs',controller.log.index);




// Only listen on $ node server.js

if (!module.parent) {
var port = process.env.PORT || process.env.C9_PORT || 4000;
  server.listen(port);
  
  console.log("Express "+(process.env.type || '')+" server listening on port %d", server.address().port);
}