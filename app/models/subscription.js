var User = require('./user');
/**
 * Memory model of Subscription, properties explicitly defined here
 */

var Subscription = function(properties) {
        this.list_id = properties.list_id;
        this.user_id = properties.user_id;
        this.email_address = properties.email_address;
        this.merge_values = properties.merge_values;
        if (properties.opt_in == "single") {
                this.double_optin = false;
            }
            else {
                this.double_optin = true;
            }
    };
Subscription.prototype.create = function(callback) {
    var subscription = this;
    var user = new User({_id: subscription.user_id});
    user.find_by_id(function(err) {
        if (err) {
            if (err.error == "not_found"){
             //mimick an mcAPI error code for usernotfound
             err.code = 100;
             err.error = "Improperly Configured Button - Wrong UserID";
            }
            callback(err);
        }
        else {
            user.API().listSubscribe({
                id: subscription.list_id,
                email_address: subscription.email_address,
                merge_values: subscription.merge_values,
                double_optin: subscription.double_optin
            }, callback);
        }
    });
};
module.exports = Subscription;
