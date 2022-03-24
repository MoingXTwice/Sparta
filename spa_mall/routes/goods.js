const router = require('express').Router();
const Goods = require('../schemas/goods');
const Carts = require('../schemas/cart')

router.get('/goods/cart', async (req, res) => {
    const carts = await Carts.find();
    const goodsIds = carts.map((cart) => cart.goodsId);
    const goods = await Goods.find({goodsId: goodsIds});

    res.json({
        cart: carts.map((cart) => ({
            quantity: cart.quantity,
            goods: goods.find((item) => item.goodsId === cart.goodsId),
        })),
    })
});

router.get('/', (req, res) => {
    res.send('this is root page');
});

// 상품 목록 조회 api
router.get('/goods',async (req, res) => {
    const {category} = req.query; // query parameter

    const goods = await Goods.find({category});

    res.json({
        goods,
    });
});

// 상품 id 조회 api
router.get('/goods/:goodsId', async (req, res) => {
    const {goodsId} = req.params; // request param

    const [goods] = await Goods.find({goodsId: Number(goodsId)});

    res.json({
        goods,
    });
});

// 상품 수정 api
router.put('/goods/:goodsId/cart', async (req, res) => {
    const {goodsId} = req.params;
    const {quantity} = req.body;

    if (quantity < 1) {
        return res.status(400).json({success: false, errorMessage: '0이상으로 가!'})
    }

    const existsCarts = await Carts.find({goodsId: Number(goodsId)});
    if (!existsCarts.length) {
        await Carts.create({goodsId: Number(goodsId), quantity});
    } else {
        await Carts.updateOne({goodsId: Number(goodsId)}, {$set: {quantity}});
    }

    res.json({success: true})
});

// 상품 제거 api
router.delete('/goods/:goodsId/cart', async (req, res) => {
    const {goodsId} = req.params;

    const existsCarts = await Carts.find({goodsId: Number(goodsId)});
    if (existsCarts.length) {
        await Carts.deleteOne({goodsId: Number(goodsId)});
    }
    res.json({success: true});
});

// 상품 추가 api
router.post('/goods', async (req, res) => {
    const {goodsId, name, thumbnailUrl, category, price} = req.body;

    const goods = await Goods.find({goodsId});
    if (goods.length) {
        return res.status(400).json({success: false, errorMessage: '이미 있는 데이터입니다.'});
    }

    let createdGoods = await Goods.create({goodsId, name, thumbnailUrl, category, price});

    res.json({goods: createdGoods})
});

module.exports = router;