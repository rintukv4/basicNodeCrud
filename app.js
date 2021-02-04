
var mysql = require('mysql');
var session = require('express-session');
var bodyPraser = require('body-parser');
var path = require('path');
var express = require('express');
const { request } = require('http');

var conn = mysql.createConnection({
  host  :'localhost',
  user  :'root',
  password:'password',
  database:'nodelogin'
});

var app = express();

app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}));
app.use(bodyPraser.urlencoded({extended:true}));
app.use(bodyPraser.json());



app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname +'/app.html'));
});

app.post('/auth', function(request,response){

  var username = request.body.username;
  var password = request.body.password;
  if (username && password){
    conn.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(err,results,fields){
        if(results.length > 0){
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect('/home');
        }else{
          response.send('Incorrect Username and Password.');
        }
        response.end();
    });
  }else{
    response.send('Please Enter Username or Password!');
    response.end();
  }
});

app.get('/home',function(request,response){
  if(request.session.loggedin){
    response.send('Welcome Back,' + request.session.username);
  }else{
    response.send('Please login to view this page!')
  }
  response.end();
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});