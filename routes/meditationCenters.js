const express = require('express');
const router = express.Router();
const meditationCenters = require('../controllers/meditationCenters');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateMeditationCenter } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const MeditationCenter = require('../models/meditationCenter');

router.route('/')
    .get(catchAsync(meditationCenters.index))
    .post(isLoggedIn, upload.array('image'), validateMeditationCenter, catchAsync(meditationCenters.createMeditationCenter))


router.get('/new', isLoggedIn, meditationCenters.renderNewForm)

router.route('/:id')
    .get(catchAsync(meditationCenters.showMeditationCenter))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateMeditationCenter, catchAsync(meditationCenters.updateMeditationCenter))
    .delete(isLoggedIn, isAuthor, catchAsync(meditationCenters.deleteMeditationCenter));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(meditationCenters.renderEditForm))



module.exports = router;