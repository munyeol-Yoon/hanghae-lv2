const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 가상의 userId 값을 할당, 가지고 올때 가상값을 가지고 온다.
userSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});

// user정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('users', userSchema);
