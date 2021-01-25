const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc     Get all users
// @route    GET /api/users
// @access   Private
exports.getUsers = asyncHandler(async (req, res, next) => {  
    res.status(200).json(res.advancedResults);  
});

// @desc     Get user
// @route    GET /api/users/:id
// @access   Public
exports.getUser = asyncHandler(async (req, res, next) => {  
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        succes: true,
        data: user
    });
});

// @desc     Create new user
// @route    POST /api/users
// @access   Public
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        succes: true,
        data: user
    })   
});

// @desc     Update user
// @route    PUT /api/users/:id
// @access   Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        succes: true,
        data: user
    })
}); 
    
// @desc     Delete user
// @route    DELETE /api/users/:id
// @access   Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    user.remove();

    res.status(200).json({
        succes: true,
        data: {}
    });
});

// @desc     Upload profile photo for user
// @route    PUT /api/users/:id/photo
// @access   Private
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    if(!req.files) {
        return next(
            new ErrorResponse(`Please upload a file`, 400)
        )
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please upload an image file`, 400)
        )
    }

    // Check file size
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`, 400)
        )
    }

    // Create custom filename
    file.name = `photo_${user._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err)
            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            )
        }

        await User.findByIdAndUpdate(req.params.id, { photo: file.name })

        res.status(200).json({
            succes: true,
            data: file.name
        })
    })
});

