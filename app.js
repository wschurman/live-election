
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

var everyone = nowjs.initialize(
  server
  // heroku stuff
  // {
  //   socketio: {
  //     transports: ['xhr-polling', 'jsonp-polling'],
  //     "polling duration": 10
  //   }
  // }
);

/* now.js methods */

var currentPosition = null;
var candidates = {};
var users = {};

/* Admin function, very insecure, but whatever */

everyone.now.updateCurrentPosition = function(pos, cd) {
  currentPosition = pos;
  candidates = cd;

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

everyone.now.switchToDebates = function() {
  try {
    everyone.now.switchMeToDebates();
  } catch(e) {
    
  }
}

/* Dashboard methods */

everyone.now.getExitPollResults = function() {
  var me = this;
  var votes = {};

  for (var c in candidates) {
    votes[c] = {
      v: [0, 0],
      c: 0
    };
  }

  _.each(everyone.users, function(user) {
    if (user.user.votes != null && user.user.votes[currentPosition] != null) {
      if (user.user.floor != null) {
        votes[user.user.votes[currentPosition]].v[user.user.floor] += 1;
      } else {
        votes[user.user.votes[currentPosition]].v[0] += .5;
        votes[user.user.votes[currentPosition]].v[1] += .5;
      }
      votes[user.user.votes[currentPosition]].c += 1;
    }
  });

  // do percentage of individual votes, anonymize

  var finalVotes = _.map(votes, function(arr, k) {
    return {
      name: k,
      first: arr.v[0] / arr.c,
      second: arr.v[1] / arr.c
    };
  });

  // anonymize data

  try {
    everyone.now.receiveExitPollResults(currentPosition, finalVotes);
  } catch(e) {

  }
}

/* Voter methods */

everyone.now.updateFloor = function(val) {
  var me = this.user;
  me.floor = val - 1; // 0th floor is 1st floor
}

everyone.now.updateSentiment = function(val) {
  var me = this.user;
  me.sentiment = val;
}

everyone.now.voteExitPoll = function(candidate) {
  var me = this.user;
  me.votes = me.votes || {};
  me.votes[currentPosition] = candidate;
}

var updateGraph = function() {
  var totals = [0.0, 0.0];
  var numVoters = [0, 0];
  var i = 0;

  _.each(everyone.users, function(user) {
    if (user.user.sentiment != null) {

      if (user.user.floor != null) {
        totals[user.user.floor] += user.user.sentiment;
        numVoters[user.user.floor] += 1;
      } else {
        totals[0] += user.user.sentiment * 0.5;
        totals[1] += user.user.sentiment * 0.5;
        numVoters[0] += 0.5;
        numVoters[1] += 0.5;
      }
      
      i++;
    }
  });

  var finalVals = _.map(totals, function(total, key) {
    return total / numVoters[key];
  });

  // console.log(totals, numVoters, finalVals);

  // send finalVal to the admin panel
  try {
    everyone.now.receiveSentimentData(finalVals);
  } catch(e) {
    // not dash
  }
}

setInterval(updateGraph, 400);
