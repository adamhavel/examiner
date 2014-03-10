var express = require('express'),
    path = require('path'),
    app = express();

app.use(express.compress());
app.use(express.static(path.resolve('../public')));

app.get('/', function(req, res) {
   res.send('Hello World!');
});

app.listen(5000);
console.log('Listening on port 5000');