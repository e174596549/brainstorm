const {Schema} = require('mongoose');

const questionSchema =  new Schema({
    uuid: {type:String},
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
questionSchema.index({'uuid': 1});
questionSchema.index({'level': 1});
questionSchema.index({'type': 1});


module.exports = questionSchema;
