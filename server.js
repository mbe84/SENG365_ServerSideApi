const db = require('./config/db'),
    express = require('./config/express'),
    bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
db.connect(function(err) {
    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1);
    } else {
        app.listen(4941, function() {
            console.log('Listening on port: ' + 4941)
        });
    }
});

