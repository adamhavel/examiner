var express = require('express');
var app = express();
app.use(express.compress());
app.use(express.static('../public'));

app.get('/', function(req, res){
  res.send('Hello World!');
});

app.listen(80);
console.log('Listening on port 80');