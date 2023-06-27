const express = require('express');
const User = require('../schemas/user.js');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { nickname, password, confirmPassword } = req.body;

        const existUser = await User.findOne({ nickname });
        // 정규표현식 처리, 닉네임에 암호가 있는 경우를 출력
        // RegExp 안에 닉네임을 삽입
        const regexp = await new RegExp(`${nickname}`);

        // ERROR 처리
        // existUser 객체가 있는 경우 (중복된 닉네임이 있는 경우)
        if (existUser) {
            return res.status(412).json({ errorMessage: '중복된 닉네임입니다.' });
        }
        // 비밀번호 일치 여부 확인
        if (password !== confirmPassword) {
            return res.status(412).json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
        }
        // 닉네임이 3글자 미만일 경우
        if (nickname.length < 3) {
            return res.status(412).json({ errorMessage: '닉네임의 형식이 일치하지 않습니다.' });
        }
        // 비밀번호가 4글자 미만인 경우
        if (password.length < 4) {
            return res.status(412).json({ errorMessage: '비밀번호 형식이 일치하지 않습니다.' });
        }
        // 비밀번호 안에 닉네임이 들어가 있는 경우
        // 닉네임이 들어가있는 경우 test 메소드를 통해 true 반환
        if (regexp.test(password)) {
            return res.status(412).json({ errorMessage: '패스워드에 닉네임이 포함되어 있습니다.' });
        }

        const newUser = await new User({ nickname, password });
        newUser.save();
        res.status(201).json({ message: '회원 가입에 성공하였습니다.' });
    } catch (err) {
        res.status(400).json({ errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
        console.log(err);
    }
});

module.exports = router;
