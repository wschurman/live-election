
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , nowjs = require('now')
  , http = require('http')
  , path = require('path');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/dash', routes.dash);
app.get('/admin', routes.admin);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var everyone = nowjs.initialize(server);

/* now.js methods */

var currentPosition = null;
var candidates = {};
var users = {};

/* Admin function, very insecure, but whatever */

everyone.now.updateCurrentPosition = function(pos, cd) {
  currentPosition = pos;
  candidates = cd;
}

everyone.now.resetSentiment = function() {
  for (var user in users) {
    users[user].sentiment = 0;
  }

  try {
    everyone.now.resetSentiment();
  } catch(e) {
    console.log(e);
  }
}

/* Dashboard methods */

everyone.now.getExitPollResults = function() {
  var me = this;

  var votes = {};
  var i = 0;

  for (var c in candidates) {
    votes[c] = 0;
  }

  for (var user in users) {
    votes[users[user].votes[currentPosition]] += 1;
  }

  // anonymize data

  me.now.recieveExitPollResults(votes);
}

/* Voter methods */

everyone.now.updateSentiment = function(val) {
  var me = this;
  console.log(me);
  // users[me].sentiment = val;
}

everyone.now.voteExitPoll = function(pos, vote) {
  var me = this;
  console.log(me);
  // users[me].votes[pos] = vote
}

var updateGraph = function() {
  var total = 0.0;
  var i = 0;

  for (var user in users) {
    total += users[user].sentiment;
    i++;
  }

  var finalVal = total / i;

  // send finalVal to the admin panel
  everyone.now.recieveSentimentData(finalVal);
}

// setInterval(); for updateGraph
