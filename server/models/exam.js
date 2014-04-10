var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExamSchema = new Schema(
   {
      subject: String,
      date: Date,
      lang: String,
      lede: String,
      duration: Number,
      sections: [
         {
            name: String,
            lede: String,
            questions: [
               {
                  name: String,
                  points: Number,
                  question: [
                     {
                        datatype: String,
                        lang: String,
                        external: Boolean,
                        content: String
                     }
                  ],
                  answer: [
                     {
                        datatype: String,
                        lang: String,
                        solution: String,
                        content: String
                     }
                  ]
               }
            ]
         }
      ]
   },
   {
      autoIndex: false
   }
);

ExamSchema.index({
   subject: 1,
   date: -1,
   lang: 1
});

mongoose.model('Exam', ExamSchema);