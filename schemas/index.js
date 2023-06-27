const mongoose = require("mongoose");

// 몽구스 연결 함수
// 에러가 발생할 경우 .catch로 에러 형성
const connect = async () => {
  mongoose
    .connect(process.env.DB_URL, {
      dbName: "Blog",
    })
    .then(() => console.log(`망고찡 연결완료`))
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;
