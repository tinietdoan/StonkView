const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userDisplayName: {type: String},
    stocksHeld: {type: String},
    numStocks: {type: Number, min: 0},
    priceAdded: {type: mongoose.Decimal128, min: 0},
    quantStocks: {type: Number, min: 1}
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;