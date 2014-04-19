var mongoose = require('mongoose'),
    Exam = mongoose.model('Exam'),
    _ = require('lodash'),
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

exports.validateUserID = function(req, res, next, uid) {
   var pattern = /^[a-z0-9]{3,8}$/i;
   if (!pattern.test(uid)) {
      return next(new Error ('not a valid user ID'));
   }
   req.uid = uid;
   return next();
};

exports.query = function(req, res) {
   var query = Exam.find().sort({ date: -1 });
   if (req.uid) {
      query = query.find({
         'student.id': req.uid
      });
   }
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
   query.populate('_blueprint', 'lede sections').exec(function(err, exams) {
      if (err) {
         res.send(500);
      } else if (!exams.length) {
         res.send(404);
      } else {
         res.send(exams);
      }
   });
};

exports.get = function(req, res) {
   Exam.findOne({
      subject: req.subject,
      lang: req.lang,
      date: req.date,
      'student.id': req.uid
   }).populate('_blueprint', 'lede sections').exec(function(err, exam) {
      if (err) {
         res.send(500);
      } else if (!exam) {
         res.send(404);
      } else {
         res.send(exam);
      }
   });
};

exports.update = function(req, res) {

   var answer = req.body.answer;

   Exam.update(
      {
         _id: new mongoose.Types.ObjectId(req.body._id),
         'answers._question': new mongoose.Types.ObjectId(answer._question)
      },
      { 'answers.$.body': answer.body },
      function(err) {
         if (err) {
            res.send(500, err);
         } else {
            res.send(200);
         }
      }
   );

};

exports.create = function(req, res) {
   _.forEach(req.body.answers, function(answer) {

      var svgChunks = _.where(answer.body, { 'datatype': 'canvas' });

      _.forEach(svgChunks, function(chunk) {
         if (chunk.content && _.isString(chunk.content)) {
            svgo.optimize(chunk.content, function(result) {
               chunk.content = result.data.replace(/<desc>[^<]*<\/desc>/, '').replace(/"/g, '\'');
            });
         }
         if (chunk.solution && _.isString(chunk.solution)) {
            svgo.optimize(chunk.solution, function(result) {
               chunk.solution = result.data.replace(/<desc>[^<]*<\/desc>/, '').replace(/"/g, '\'');
            });
         }
      });

   });

   var id = req.body._id || mongoose.Types.ObjectId();
   delete req.body._id;

   Exam.findByIdAndUpdate(id, req.body, { upsert: true }, function(err, exam) {
      if (err) {
         res.send(500, err);
      } else {
         res.send(exam);
      }
   });
};

exports.all = function(req, res) {
   res.send('Hello world!');
};