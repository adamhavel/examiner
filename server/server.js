var express = require('express'),
    compression = require('compression'),
    path = require('path'),
    app = express();

app.use(compression());
app.use(express.static(path.resolve('../public')));

app.route('/test')
   .get(function(req, res) {
      res.send('Hello World!');
   });

app.listen(5000);
console.log('Listening on port 5000');