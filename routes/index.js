const express = require('express');

const postRouter = require('./post');
const commentRouter = require('./comments');
const signupRouter = require('./signup');
const loginRouter = require('./login');

const router = express.Router();

// 홈페이지일 경우
router.get('/', (req, res) => {
    res.send("HJ's Blog!");
});
//posts router 연결 후 postRouter 연결
router.use('/posts', [postRouter, commentRouter]);
router.use('/signup', signupRouter);
router.use('/login', loginRouter);

module.exports = router;
