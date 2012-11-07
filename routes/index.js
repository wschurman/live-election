
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Woah Election Voter!' });
};

exports.dash = function(req, res){
  res.render('dash', { title: "Woah Election Dashboard!" });
}

exports.admin = function(req, res){
  res.render('admin', { title: "Woah Election Admin!" });
}