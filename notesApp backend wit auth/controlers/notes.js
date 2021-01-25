const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Note = require('../models/Note');
const User = require('../models/User');

// @desc     Get all notes
// @route    GET /api/notes
// @route    GET /api/users/:userId/notes
// @access   Private

exports.getNotes = asyncHandler(async (req, res, next) => {
    // if(req.params.userId) {
    //     const notes = await Note.find({ user: req.params.userId });

    if(req.user.id) {
        const notes = await Note.find({ user: req.user.id });

        return res.status(200).json({
            succes: true,
            count: notes.length,
            data: notes
        })
    } else {
        res.status(200).json(res.advancedResults);    
    }

    const notes = await query;

    res.status(200).json({
        succes: true,
        count: notes.length,
        data: notes
    })
}); 

// @desc     Get single note
// @route    GET /api/notes/:id
// @access   Private

exports.getNote = asyncHandler(async (req, res, next) => {
    let note = await Note.findById(req.params.id);

    // let note = await Note.findById(req.params.id).populate({
    //     path: 'user',
    //     select: 'firstName lastName email' 
    // })

    if(!note) {
        return next(
            new ErrorResponse(`Note not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is note owner
    if(note.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorised to access this note`, 401)
        );
    }

    
    note = await Note.findById(req.params.id).populate({
        path: 'user',
        select: 'firstName lastName email' 
    })

    res.status(200).json({
        succes: true,
        data: note
    })
}); 

// @desc     Add Note
// @route    POST /api/users/:userId/notes
// @access   Private
exports.addNote = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id

    // const user = await User.findById(req.params.userId);

    // if(!user) {
    //     return next(
    //         new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    //     );
    // }

    const note = await Note.create(req.body)

    res.status(200).json({
        succes: true,
        data: note
    })
}); 

// @desc     Update Note
// @route    PUT /api/notes/:id
// @access   Private
exports.updateNote = asyncHandler(async (req, res, next) => {
    let note = await Note.findById(req.params.id);

    if(!note) {
        return next(
            new ErrorResponse(`Note not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is note owner
    if(note.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorised to access this note`, 401)
        );
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        succes: true,
        data: note
    })
});

// @desc     Delete Note
// @route    DELETE /api/notes/:id
// @access   Private
exports.deleteNote = asyncHandler(async (req, res, next) => {
    const note = await Note.findById(req.params.id);

    if(!note) {
        return next(
            new ErrorResponse(`Note not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is note owner
    if(note.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorised to access this note`, 401)
        );
    }

    await note.remove();

    res.status(200).json({
        succes: true,
        data: {}
    })
});