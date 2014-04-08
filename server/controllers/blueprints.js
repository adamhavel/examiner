var mongoose = require('mongoose'),
    Blueprint = mongoose.model('Blueprint'),
    svgo = new (require('svgo'))();

exports.validateSubject = function(req, res, next, subject) {
   var pattern = /^\w{2}-\w{3}$/i;
   if (!pattern.test(subject)) {
      return next(new Error ('not a valid subject code'));
   }
   req.subject = subject;
   return next();
};

exports.validateDate = function(req, res, next, date) {
   var pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/i;
   if (!pattern.test(date)) {
      return next(new Error ('not a valid date'));
   }
   // var dateArr = date.split('-').map(function (value) {
   //    return parseInt(value, 0);
   // });
   // req.startDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
   // req.endDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2] + 1);
   req.date = date;
   return next();
};

exports.validateLang = function(req, res, next, lang) {
   var pattern = /^[a-z]{2}$/i;
   if (!pattern.test(lang)) {
      return next(new Error ('not a valid language code'));
   }
   req.lang = lang;
   return next();
};

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
   req.body.sections.forEach(function(section) {
      section.questions.forEach(function(question) {
         question.body.forEach(function(chunk) {
            if (chunk.datatype === 'canvas') {
               svgo.optimize(chunk.content, function(result) {
                  chunk.content = result.data;
               });
            }
         });
         question.answer.forEach(function(chunk) {
            if (chunk.datatype === 'canvas') {
               svgo.optimize(chunk.content, function(result) {
                  chunk.content = result.data;
               });
               if (chunk.hint) {
                  svgo.optimize(chunk.hint, function(result) {
                     chunk.hint = result.data;
                  });
               }
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