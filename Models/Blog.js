const mongoose = require('mongoose');
const Schema = mongoose.Schema

// create schema
const BlogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
        required: true
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true,
            },
            name: {
                type: String
            },
            photo: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ]
})

module.exports = Blog = mongoose.model('blog', BlogSchema)