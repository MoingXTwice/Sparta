const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    board_id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Goods', goodsSchema);