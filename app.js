
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , nowjs = require('now')
  , _ = require('underscore')
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

  console.log(pos, cd);

  try {
    everyone.now.updateMyCurrentPosition(pos, cd);
  } catch(e) {

  }
}

everyone.now.resetSentiment = function() {
  _.each(everyone.users, function(user) {
    if (user.user.sentiment) {
      user.user.sentiment = 0;
    }
  });

  try {
    everyone.now.resetMySentiment();
  } catch(e) {
    // odd
  }
}

/* Dashboard methods */

everyone.now.getExitPollResults = function() {
  var me = this;
  var votes = {};

  for (var c in candidates) {
    votes[c] = 0;
  }

  _.each(everyone.users, function(user) {
    if (user.user.votes && user.user.votes[currentPosition]) {
      votes[user.user.votes[currentPosition]] += 1;
    }
  });

  finalVotes = _.keys(votes);
  finalVotes = _.sortBy(finalVotes, function(name) {
    return -1 * votes[name];
  });

  // anonymize data

  me.now.receiveExitPollResults(currentPosition, finalVotes);
}

/* Voter methods */

everyone.now.updateSentiment = function(val) {
  var me = this.user;
  me.sentiment = val;
  console.log("updateSentiment:", me);
}

everyone.now.voteExitPoll = function(candidate) {
  var me = this.user;
  me.votes = me.votes || {};
  me.votes[currentPosition] = candidate;
}

var updateGraph = function() {
  var total = 0.0;
  var i = 0;

  _.each(everyone.users, function(user) {
    if (user.user.sentiment) {
      total += user.user.sentiment;
      i++;
    }
  });

  var finalVal = total / i;

  // send finalVal to the admin panel
  try {
    everyone.now.receiveSentimentData(finalVal);
  } catch(e) {
    // not dash
  }
}

setInterval(updateGraph, 500);
