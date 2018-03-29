const {Schema} = require('mongoose');

const questionSchema =  new Schema({
    questionName: {type:String},
    describe: {type:String},
    answers: [{type:String}],
    rightAnswer: {type:Number},
    level: {type:Number},
    type: {type:Number}
},{
    timestamps: {
        createdAt: 'created_at',updatedAt : 'update_at'
    }
});


questionSchema.index({'questionName': 1});
module.exports = questionSchema;
