var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema(
   {
      name: String,
      points: Number,
      body: [
         {
            datatype: String,
            lang: String,
            content: Schema.Types.Mixed
         }
      ],
      answer: [
         {
            datatype: String,
            lang: String,
            content: Schema.Types.Mixed,
            solution: Schema.Types.Mixed
         }
      ]
   },
   {
      autoIndex: false
   }
);

mongoose.model('Question', QuestionSchema);

var BlueprintSchema = new Schema(
   {
      subject: String,
      date: String,
      lang: String,
      lede: String,
      duration: Number,
      sections: [
         {
            name: String,
            lede: String,
            points: Number,
            questions: [QuestionSchema]
         }
      ]
   },
   {
      autoIndex: false
   }
);

BlueprintSchema.index({
   'subject': 1,
   'date': -1,
   'lang': 1
});

mongoose.model('Blueprint', BlueprintSchema);