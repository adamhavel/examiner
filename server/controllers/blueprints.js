var mongoose = require('mongoose'),
    Blueprint = mongoose.model('Blueprint'),
    _ = require('lodash'),
    moment = require('moment'),
    svgo = new (require('svgo'))();

exports.query = function(req, res) {
   var dbQuery = Blueprint.find(),
       q = req.query;

   if (q.subject) {
      dbQuery = dbQuery.find({
         subject: { $regex: new RegExp(q.subject, 'i'), $in: req.user.subjects }
      });
   } else {
      dbQuery = dbQuery.find({
         subject: { $in: req.user.subjects }
      });
   }

   if (q.fields) {
      dbQuery = dbQuery.select(q.fields.replace(/,/g, ' '));
   }

   if (q.lang) {
      dbQuery = dbQuery.find({
         lang: q.lang
      });
   }

   if (q.date) {
      dbQuery = dbQuery.find({
         date: q.date
      });
   }

   dbQuery.lean().exec(function(err, blueprints) {
      if (err) {
         res.send(500);
      } else {
         res.send(blueprints);
      }
   });
};

exports.get = function(req, res) {
   var p = req.params;

   var dbQuery = Blueprint.findOne({
      subject: p.subject,
      lang: p.lang,
      date: p.date
   });

   if (req.query.fields) {
      dbQuery = dbQuery.select(q.fields.replace(/,/g, ' '));
   }

   if (req.user.role === 'student') {
      if (moment() < moment(p.date)) {
         dbQuery.select('-sections -lede');
      } else {
         dbQuery.select('-sections.questions.answer.solution');
      }
   }

   dbQuery.lean().exec(function(err, blueprint) {
      if (err) {
         res.send(500, err);
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
                  chunk.content = result.data.replace(/<desc>[^<]*<\/desc>/, '').replace(/"/g, '\'');
               });
            }
            if (chunk.solution) {
               svgo.optimize(chunk.solution, function(result) {
                  chunk.solution = result.data.replace(/<desc>[^<]*<\/desc>/, '').replace(/"/g, '\'');
               });
            }
         });

      });
   });

   var id = req.body._id || mongoose.Types.ObjectId();
   delete req.body._id;

   Blueprint.findByIdAndUpdate(id, req.body, { upsert: true }, function(err, blueprint) {
      if (err) {
         res.send(500, err);
      } else {
         res.send(blueprint);
      }
   });

};