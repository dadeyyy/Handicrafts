const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const opts = { toJSON: {virtuals: true}}
const HandicraftSchema = new Schema({
    title: String,
    description: String,
    isValidated: Boolean,
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    products: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HandicraftSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong>
    <a href="/handicrafts/${this._id}">${this.title}</a>
    </strong>
    <p>${this.description.substring(0,20)}...</p>
    `
})


HandicraftSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Handicraft', HandicraftSchema);
