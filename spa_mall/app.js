const express = require("express");
const app = express();
const port = 3000;

const goodsRouter = require('./routes/goods');

const useMiddleWare = (req, res, next) => {
    console.log("Request URL : ", req.originalUrl, " - ", new Date());
    next();
}

app.use(useMiddleWare);
app.use('/api', goodsRouter);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌어요!');
});