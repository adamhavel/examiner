var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExamSchema = new Schema(
   {
      /*_id: Number,
      name: String,
      location: String,
      added: Date,
      categories: Array,
      image: String*/
   }
);

mongoose.model('Exam', ExamSchema);