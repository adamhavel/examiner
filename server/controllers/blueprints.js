var mongoose = require('mongoose'),
    Blueprint = mongoose.model('Blueprint'),
    _ = require('lodash'),
    svgo = new (require('svgo'))();

exports.query = function(req, res) {
   var query = Blueprint.find().sort({ date: -1 });
   if (req.subject) {
      query = query.find({
         subject: req.subject
      });
   }
   if (req.lang) {
      query = query.find({
         lang: req.lang
      });
   }
   if (req.date) {
      query = query.find({
         date: req.date
      });
   }
   query.exec(function(err, blueprints) {
      if (err) {
         res.send(500);
      } else if (!blueprints.length) {
         res.send(404);
      } else {
         res.send(blueprints);
      }
   });
};

exports.get = function(req, res) {
   Blueprint.findOne({
      subject: req.subject,
      lang: req.lang,
      date: req.date
   }).exec(function(err, blueprint) {
      if (err) {
         console.log(err);
         res.send(500);
      } else if (!blueprint) {
         res.send(404);
      } else {
         res.send(blueprint);
      }
   });
};

exports.create = function(req, res) {
   _.forEach(req.body.sections, function(section) {
      _.forEach(section.questions, function(question) {

         var svgChunks = _.where(question.body.concat(question.answer), { 'datatype': 'canvas' });

         _.forEach(svgChunks, function(chunk) {
            if (chunk.content) {
               svgo.optimize(chunk.content, function(result) {
                  chunk.content = result.data;
               });
            }
            if (chunk.solution) {
               svgo.optimize(chunk.solution, function(result) {
                  chunk.solution = result.data;
               });
            }
         });

      });
   });

   var blueprint = new Blueprint(req.body);

   blueprint.save(function(err) {
      if (err) {
         res.send();
      } else {
         res.send(blueprint);
      }
   });
};