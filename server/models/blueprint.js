var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlueprintSchema = new Schema(
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
            points: Number,
            questions: [
               {
                  name: String,
                  points: Number,
                  body: [
                     {
                        datatype: String,
                        lang: String,
                        content: String
                     }
                  ],
                  answer: [
                     {
                        datatype: String,
                        lang: String,
                        content: String,
                        hint: String
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

BlueprintSchema.index({
   subject: 1,
   date: -1,
   lang: 1
});

mongoose.model('Blueprint', BlueprintSchema);