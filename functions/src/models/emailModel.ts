const mongoose = require('mongoose');
// const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const emailSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            trim: true,
            maxlength: [200, 'Your subject is too long'],
		},
		content: {
			type: String,
			trim: true,
			maxlength: [10000, 'Your email is too long'],
		},
		from: {
			type: String,
			trim: true,
			maxlength: [50, 'Your email from address is too long'],
		},
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// tourSchema.virtual('reviews', {
//     ref: 'Review',
//     foreignField: 'tour',
//     localField: '_id'
// });

// tourSchema.virtual('durationWeeks').get(function() {
//     return Math.floor((this.duration / 7) * 10) / 10;
// });

// tourSchema.virtual('endDates').get(function() {
//     const that = this;
//     const endCalc = function(el) {
//         el.setDate(el.getDate() + that.duration);
//         return el;
//     };

//     const endDates = this.startDates ? this.startDates.map(endCalc) : [];
//     return endDates;
// });

// tourSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'reviews'
//     });
//     next();
// });

// tourSchema.pre('save', function(next: any) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });

// tourSchema.pre('save', async function(next) {
//     const guidesProm = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesProm);
//     next();
// });

// tourSchema.pre('save', function(next) {
//     console.log('Will Save');
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });
// const unSecret = function(next) {
//     // tourSchema.pre('find', function(next) {
//     this.find({ secretTour: { $ne: true } });
//     // this.start = Date.now();
//     next();
// };
// tourSchema.pre('find', unSecret);
// // tourSchema.pre('findOne', unSecret);
// tourSchema.pre('findByIdAndRemove', unSecret);
// // tourSchema.pre('findOneAndUpdate', unSecret);
// tourSchema.pre('findOneAndRemove', unSecret);
// tourSchema.pre('findOneAndReplace', unSecret);
// // tourSchema.pre('findOneAndDelete', unSecret);
// tourSchema.pre('findMany', unSecret);

// tourSchema.post(/^find/, function(docs, next) {
//     console.log(
//         `Query took ${(Date.now() - this.start) / 1000} seconds to run`
//     );
//     next();
// });

// tourSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'guides',
//         select: '-__v -passwordChangedAt'
//     }).populate({
//         path: 'reviews',
//         select: '-__v'
//     });
//     next();
// });

// tourSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     next();
// });

// tourSchema.index({ price: 1 }); // NOW every time we will search through the collection the price index will be cached and save us time as it is the most popular filter index but it is still very heavy in size (the 1 stands for ascending and descending), you can add options for the index in a second argument object
// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });
const Email = mongoose.model('Email', emailSchema);
module.exports = Email;