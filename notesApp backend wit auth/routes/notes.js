const express = require('express');
const { 
    getNotes,
    getNote,
    addNote,
    updateNote,
    deleteNote
} = require('../controlers/notes');

const Note = require('../models/Note');

// const router = express.Router({ mergeParams: true });
const router = express.Router();

const advancedResults = require('../middleware/advancedResults')
const { protect } = require('../middleware/auth')

router
    .route('/')
    .get(protect,
        advancedResults(Note, {
            path: 'user',
            select: 'firstName lastName email' 
    }), 
    getNotes
    )
    .post(protect, addNote)

router
    .route('/:id')
    .get(protect, getNote)
    .put(protect, updateNote)
    .delete(protect, deleteNote)

module.exports = router;
