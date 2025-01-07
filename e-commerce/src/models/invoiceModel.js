
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model('Invoice', invoiceSchema);
