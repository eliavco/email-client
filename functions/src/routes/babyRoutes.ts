const express = require('express');
const babyController = require('./../controllers/babyController');
// const authController = require('./../controllers/authController');

const router = express.Router();

// const { protect, restrict } = authController;
// If login is required, add protect as first middleware

router
	.route('/')
	.get(babyController.makeQueries, babyController.getAllBabies)
	.post(babyController.createBaby);

router
	.route('/:id')
	.get(babyController.getBaby)
	.put(babyController.updateBabyRating)
	.patch(babyController.updateBaby)
	.delete(babyController.deleteBaby);

// router
// 	.route('/image/:id')
// 	.get(babyController.getDownloadableLink);

module.exports = router;