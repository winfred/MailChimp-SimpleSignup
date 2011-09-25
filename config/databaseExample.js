var cradle = require('cradle');

var settings = {

    host: 'somewhere.iriscouch.com',
    port: '6984',
    user: 'some_user',
    password: "some_password",
    db: 'pro',
    db_dev: 'dev',
    db_test: 'test'
    
};
// Configure CouchDB
cradle.setup({
    cache: false,
    raw: false
});
var connection = new(cradle.Connection)(
    settings.host, settings.port,{
        secure: true,
        auth: {
            username: settings.user,
            password: settings.password
        }});
    
if (process.env.type == 'testing') {
    var db = connection.database(settings.db_test);
}
else if (process.env.type == 'development') {
    var db = connection.database(settings.db_dev);
}
else {
    var db = connection.database(settings.db);
}

module.exports.db = db;
module.exports.connection = connection;