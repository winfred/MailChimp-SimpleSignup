/**
 *Using another OAuth wrapper to have more control than node-mailchimp
 * replace these values - duh
 * Dev Oauth app should have '127.0.0.1/connect' callback set up
 * Production Oauth app should have 'someURL.com/connect' callback setup
 */
var OAuth = require('oauth').OAuth2;
if (process.env.type == "development" || process.env.type == "testing") {
    var clientID = 'dev/testAccountID',
        clientSecret = 'dev/testAccountSecret';
}
else {
    var clientID = 'productionAccountID',
        clientSecret = 'productionAccountSecret';
}
module.exports = new OAuth(clientID, clientSecret, "https://login.mailchimp.com", "/oauth2/authorize", "/oauth2/token");