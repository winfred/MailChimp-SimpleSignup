var oauth = require('../../config/oauth'),
    User = require('../models/user');
/**
 * Node-MailChimp creates a separate server instance which probably wont 
 * jive with heroku, so I rolled my own into this server
 * This is one ugly ass series of requests.
 * Fat controllers are bad, but over-abstract design is even worse.
 * Leaving this mess here for now
 */
module.exports.connect = function(req, res) {
    oauth.getOAuthAccessToken(req.query.code, {
        grant_type: 'authorization_code',
        redirect_uri: server.basepath + "/connect"
    }, function(error, access_token, refresh_token) {
        if (error) {
            handle_error(res, error);
        }
        else {
            oauth._request("GET", "https://login.mailchimp.com/oauth2/metadata", {
                Authorization: 'OAuth ' + access_token
            }, "", "", function(meta_error, metadata, responseCode) {
                if (meta_error) {
                    handle_error(res, meta_error);
                }
                var user = new User({
                    apikey: (access_token + "-" + JSON.parse(metadata).dc)
                });
                user.fetchLists(function() {
                    user.fetchUserID(function() {
                        user.save(function() {
                            req.session.user = new User(user);
                            res.redirect('/dashboard');
                        });
                    });
                });
            });
        }
    });
};
var handle_error = function(res, error) {
        console.log(error);
        res.render('index', {
            notice: 'Something bad happened between us and the Chimp. ' + error
        });
    };