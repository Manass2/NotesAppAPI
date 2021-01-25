const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title : {
        type: String,
        trim: true, 
        required: [true, 'Please add a title']
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true  
    }   
});

module.exports = mongoose.model('Note', NotesSchema);