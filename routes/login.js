const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

// 로그인 api 인가된 사람인지 확인하고 토큰을 발급하며 로그인을 하는 기능
router.post('/', async (req, res) => {
    try {
        const { nickname, password } = req.body;
        // 해당 닉네임을 가진 유저를 찾는다.
        const findUser = await User.findOne({ nickname });

        // 유저가 없거나 닉네임, 패스워드가 일치하지 않는다면 오류와함께 리턴한다.
        if (!findUser || findUser.nickname !== nickname || findUser.password !== password) {
            return res.status(412).json({ errorMessage: '닉네임 또는 패스워드를 확인해주세요.' });
        }

        // 해당 유저에 대한 토큰을 발급한다.
        const tokenUser = await jwt.sign({ userId: findUser.userId }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        // 발급된 토큰을 쿠키에 넣는다.
        res.cookie('Authorization', `Bearer ${tokenUser}`);

        // 종료한다.
        return res.status(200).json({ token: tokenUser });
    } catch (err) {
        res.status(400).json({ errMessage: '로그인에 실패하였습니다.' });
    }
});
module.exports = router;
