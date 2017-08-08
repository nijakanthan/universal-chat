var express = require('express');
var app = express();

app.use('/components', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/dist'));

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html');
});
 
app.listen(3000, function() {
    console.log('Listening on 3000');
});