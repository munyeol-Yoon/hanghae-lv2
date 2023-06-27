const mongoose = require('mongoose');

// comment Schema 작성
const commentSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    commentContent: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('comments', commentSchema);
