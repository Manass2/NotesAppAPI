const crypto = require('crypto')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Encrypt password using bcrt
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken foreignField
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken
}

module.exports = mongoose.model('User', UserSchema);