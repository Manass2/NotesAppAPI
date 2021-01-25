const express = require('express');
const { 
    getNotes,
    getNote,
    addNote,
    updateNote,
    deleteNote
} = require('../controlers/notes');

const Note = require('../models/Note');
const advancedResults = require('../middleware/advancedResults')

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        advancedResults(Note, {
            path: 'user',
            select: 'firstName lastName email' 
    }), 
    getNotes
    )
    .post(addNote)

router
    .route('/:id')
    .get(getNote)
    .put(updateNote)
    .delete(deleteNote)

module.exports = router;
