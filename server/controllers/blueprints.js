var mongoose = require('mongoose'),
    Blueprint = mongoose.model('Blueprint');

exports.filterBySubject = function(req, res, next, subject) {
   var pattern = /^\w{2}-\w{3}$/i;
   if (!pattern.test(subject)) {
      return next(new Error ('not a valid subject code'));
   }
   req.storeQuery = (req.storeQuery || Blueprint).find({
      subject: subject
   });
   return next();
};

exports.filterByDate = function(req, res, next, date) {
   var pattern = /^\d{4}-\d{1,2}-\d{1,2}$/i;
   if (!pattern.test(date)) {
      return next(new Error ('not a valid date'));
   }
   var dateArr = date.split('-').map(function (value) {
      return parseInt(value, 0);
   });
   var startDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
   var endDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2] + 1);
   req.storeQuery = (req.storeQuery || Blueprint).find({
      date: {$gte: startDate, $lt: endDate}
   });
   return next();
};

exports.filterByLang = function(req, res, next, lang) {
   var pattern = /^[a-z]{2}$/i;
   if (!pattern.test(lang)) {
      return next(new Error ('not a valid language code'));
   }
   req.storeQuery = (req.storeQuery || Blueprint).find({
      lang: lang
   });
   return next();
};

exports.query = function(req, res) {
   (req.storeQuery || Blueprint.find()).exec(function(err, blueprints) {
      if (err) {
         res.send(500);
      } else {
         res.send(blueprints);
      }
   });
};

exports.get = function(req, res) {
   req.storeQuery.limit(1).exec(function(err, blueprint) {
      if (err) {
         res.send(500);
      } else {
         res.send(blueprint[0]);
      }
   });
};