const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hi");
});
app.use('/api', bodyParser.json(), router);
app.use(express.static('./assets'));

app.listen(8080, () => {
    console.log('어머나! 서버가 열렸어요! 어서 들어가볼까요?');
});