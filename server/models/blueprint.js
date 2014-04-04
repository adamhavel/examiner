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

/*{
    "_id" : ObjectId("5331b20d69915ad377fbb59b"),
    "subject" : "MI-MDW",
    "date" : ISODate("2014-02-10T10:50:42.389Z"),
    "lang" : "en",
    "lede" : "Lorem ipsum dolor sit emet",
    "duration" : 3600,
    "sections" : [
        {
            "name" : "Section A",
            "lede" : "Lorem ipsum dolor sit emet",
            "questions" : [
                {
                    "name" : null,
                    "points" : 5,
                    "question" : [
                        {
                            "datatype" : "text",
                            "content" : "Lorem ipsum dolor sit emet"
                        },
                        {
                            "datatype" : "image",
                            "external" : true,
                            "content" : "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png"
                        }
                    ],
                    "answer" : [
                        {
                            "datatype" : "code",
                            "lang" : "javascript",
                            "solution" : "alert('Hello world')",
                            "content" : "alert()"
                        }
                    ]
                }
            ]
        }
    ]
}*/