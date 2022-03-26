const express = require('express');
const Http = require('http');
const socketIo = require('socket.io');
const {Op} = require("sequelize");
const {User, Cart, Goods} = require('./models'); //index는 생략 가능
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middlewares/auth-middleware');

const app = express();
const http = Http.createServer(app);
const io = socketIo(http);
const router = express.Router();

io.on('connection', (socket) => {
    console.log('누군가 연결했어요!');

    socket.on("BUY", (data) => {
        const payload = {
            nickname: data.nickname,
            goodsId: data.goodsId,
            goodsName: data.goodsName,
            date: new Date().toISOString(),
        }
        console.log('클라이언트가 구매한 data : ', data, new Date());
        socket.broadcast.emit('BUY_GOODS', payload);
    })

    socket.on('disconnect', () => {
        console.log('누군가 연결을 끊었어요!')
    })
})

// 회원가입 validate
const postUsersSchema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
});

// 회원가입 api
router.post('/users', async (req, res) => {
    try {
        const {nickname, email, password, confirmPassword} = await postUsersSchema.validateAsync(req.body);

        if (password !== confirmPassword) {
            res.status(400).send({errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.'});
            return;
        }

        const existUsers = await User.findAll({
            where: {
                [Op.or]: [{nickname}, {email}],
            },
        });
        if (existUsers.length) {
            res.status(400).send({errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.'});
            return;
        }

        await User.create({email, nickname, password});

        res.status(201).send({});
    } catch (e) {
        console.log(e)
        res.status(400).send({errorMessage: '요청한 형식이 올바르지 않습니다.'})
    }

});

// 로그인 validate
const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// 로그인 api
router.post('/auth', async (req, res) => {
    try {
        const {email, password} = await postAuthSchema.validateAsync(req.body);

        const user = await User.findOne({where: {email, password}});

        if (!user) {
            res.status(401).send({errorMessage: '이메일 또는 패스워드가 잘못되었습니다.'});
            return;
        }

        const token = jwt.sign({userId: user.userId}, 'hello-secret-key-SHINee-Key');

        res.send({token});
    } catch (e) {
        console.log(e)
        res.status(400).send({errorMessage: '몬가.. 몬가 잘못됨...'})
    }
});

// 암튼 몬가.. 몬가받음...
router.get('/users/me', authMiddleware, async (req, res) => {
    const {user} = res.locals;

    res.send({user,});
});

router.get('/goods/cart', authMiddleware, async (req, res) => {
    const {userId} = res.locals.user;
    console.log(userId);
    const carts = await Cart.findAll({
        where: {
            userId,
        }
    });

    console.log('hh', carts)
    const goodsIds = carts.map((cart) => cart.goodsId);

    // 루프 줄이기 위해 Mapping 가능한 객체로 만든것
    const goodsKeyById = await Goods.findAll({
        where: {
            goodsId: goodsIds,
        },
    })
        .then((goods) =>
            goods.reduce(
                (prev, g) => ({
                    ...prev,
                    [g.goodsId]: g,
                }),
                {}
            )
        );

    res.json({
        cart: carts.map((cart) => ({
            quantity: cart.quantity,
            goods: goodsKeyById[cart.goodsId],
        })),
    });
});

router.get('/', (req, res) => {
    res.send('this is root page');
});

// 상품 목록 조회 api
router.get('/goods', authMiddleware, async (req, res) => {
    const {category} = req.query; // query parameter
    const goods = await Goods.findAll({
        order: [['goodsId', 'DESC']],
        where: category ? {category} : undefined,
    });

    res.json({
        goods,
    });
});

// 상품 id 조회 api
router.get('/goods/:goodsId', authMiddleware, async (req, res) => {
    const {goodsId} = req.params; // request param
    const goods = await Goods.findByPk(goodsId);

    if (!goods) {
        res.status(400).send({});
    } else {
        res.send({goods});
    }
});

// 상품 추가, 수정 api
router.put('/goods/:goodsId/cart', authMiddleware, async (req, res) => {
    const {userId} = res.locals.user;
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCart = await Cart.findOne({
        where: {
            userId,
            goodsId,
        },
    });

    if (existsCart) {
        existsCart.quantity = quantity;
        await existsCart.save();
    } else {
        await Cart.create({
            userId,
            goodsId,
            quantity,
        });
    }

    res.send({});
});

// 상품 제거 api
router.delete('/goods/:goodsId/cart', authMiddleware, async (req, res) => {
    const {userId} = res.locals.user;
    const {goodsId} = req.params;

    const existsCart = await Cart.findOne({
        where: {
            userId,
            goodsId,
        },
    });
    if (existsCart) {
        await existsCart.destroy();
    }

    res.send({});
});


// // 상품 추가 api
// router.post('/goods', authMiddleware, async (req, res) => {
//     const {goodsId, name, thumbnailUrl, category, price} = req.body;
//
//     const goods = await Goods.find({goodsId});
//     if (goods.length) {
//         return res.status(400).json({success: false, errorMessage: '이미 있는 데이터입니다.'});
//     }
//
//     let createdGoods = await Goods.create({goodsId, name, thumbnailUrl, category, price});
//
//     res.json({goods: createdGoods})
// });


app.use("/api", express.urlencoded({extended: false}), router);
app.use(express.static("assets"));

http.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});