var express = require('express');
var app = express();
 
app.use(express.static(__dirname + '/src'));

app.get('/', function (request, response) {
  response.sendFile('index.html');
});
 
app.listen(3000, function() {
    console.log('Listening on 3000');
});