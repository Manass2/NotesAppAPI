const express = require('express');
const { 
    getUsers, 
    getUser,
    registerUser,
    updateUser,
    deleteUser,
    userPhotoUpload
} = require('../controlers/users');

const User =require('../models/User')

const advancedResults = require('../middleware/advancedResults');

// Include other ressource routers
const notesRouter = require('./notes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:userId/notes', notesRouter);

router
    .route('/:id/photo')
    .put(userPhotoUpload)

router
    .route('/')
    .get(advancedResults(User, 'notes'), getUsers)
    .post(registerUser)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router;