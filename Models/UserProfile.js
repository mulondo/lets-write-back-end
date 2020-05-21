const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 80
    },
    company: {
        type: String
    },
    hobbies: {
        type: [String]
    },
    inspiration: {            
        type: [String]
    },
    bio: {
        type: String
    },
    status: {
        type: String
    },
    experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date,
            },
            current: {
                type: Boolean,
                default: false
            }
        }
    ],
    social: {
        facebook: {
            type: String
        },
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        }
    }
})

module.exports = UserProfile = mongoose.model('userprofile',UserProfileSchema)
