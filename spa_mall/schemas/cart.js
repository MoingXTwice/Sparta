const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    goodsId: {
        type: Number,
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
    },
});

module.exports = mongoose.model('Carts', cartSchema);