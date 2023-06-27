const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

const jwtValidation = async (req, res, next) => {
    const { Authorization } = req.cookies;
    // ?? 연산자 = 변수가 undefined이거나 null일 경우 다음걸로 변경해라
    const [authType, authToken] = (Authorization ?? '').split(' ');

    // Token이 없는 경우 에러 발생
    if (!authToken) {
        return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    try {
        // JWT 토큰 확인
        const { userId } = await jwt.verify(authToken, process.env.SECRET_KEY);
        const user = await User.findById(userId);
        // user로 저장하기
        res.locals.user = user;
        next();

        // 토큰 오류 발생한 경우
    } catch (error) {
        res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
        console.log(error);
    }
};

module.exports = jwtValidation;
