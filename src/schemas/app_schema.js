const {Schema} = require('mongoose');

const appSchema =  new Schema({
    secret_key : {type:String,required:true},
    name : {type:String},
    urls : {
        ppt_notify : {type : String, default:''},
        playback_notify : {type : String, default:''}
    }
},{ 
    timestamps: { 
        createdAt: 'created_at',updatedAt : 'update_at' 
    } 
});



module.exports = appSchema;