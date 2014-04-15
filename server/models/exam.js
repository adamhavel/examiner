var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExamSchema = new Schema(
   {
      student: {
         name: String,
         id: String
      },
      subject: String,
      date: String,
      lang: String,
      answers: [
         {
            content: [Schema.Types.Mixed],
            points: Number
         }
      ]
   },
   {
      autoIndex: false
   }
);

ExamSchema.index({
   'subject': 1,
   'date': -1,
   'lang': 1,
   'student.id': 1
});

mongoose.model('Exam', ExamSchema);