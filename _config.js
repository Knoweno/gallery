var config = {}
const mongoBaseURL = 'mongodb+srv://knowenobiso:DWKMiPk7rPzEOkId@moringadevops.b9yyp.mongodb.net/darkroom?retryWrites=true&w=majority&appName=MoringaDevOps';

//'mongodb+srv://<USERNAME>:<PASSWORD>@gallery.wc344.mongodb.net/darkroom?retryWrites=true&w=majority',
// Update to have your correct username and password
config.mongoURI = {
    production: mongoBaseURL,
    development: mongoBaseURL,
    test: mongoBaseURL,
}
module.exports = config;
