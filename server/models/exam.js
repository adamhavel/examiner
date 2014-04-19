var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExamSchema = new Schema(
   {
      student: {
         name: String,
         id: String
      },
      _blueprint: {
         type: Schema.Types.ObjectId,
         ref: 'Blueprint'
      },
      evaluated: { type: Schema.Types.Mixed, default: null },
      subject: String,
      date: String,
      lang: String,
      answers: [
         {
            _question: {
               type: Schema.Types.ObjectId,
               ref: 'Question'
            },
            body: [Schema.Types.Mixed],
            points: { type: Number, default: 0 },
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