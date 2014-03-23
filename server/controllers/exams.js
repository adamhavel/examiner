var mongoose = require('mongoose'),
    Exam = mongoose.model('Exam');

exports.all = function(req, res) {
   res.send('Hello world!');
};