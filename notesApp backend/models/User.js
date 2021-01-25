const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add your First Name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add your Last Name']
    },
    age: {
        type: Number,
        required: [true, 'Please add your age']
    },
    userName: {
        type: String,
        required: [true, 'Please add your username']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please select a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true}
});

// Cascade delete notes when a user is deleted
UserSchema.pre('remove', async function(next) {
    // console.log(`Notes being removed from user ${this._id}`)
    await this.model('Note').deleteMany({ user: this._id });
    next();
})

// Reverse populate with virtuals
UserSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'user',
    justOne: false    
})

module.exports = mongoose.model('User', UserSchema);