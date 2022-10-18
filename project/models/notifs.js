// notifications schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifsSchema = new Schema({
    date: {type: String},
});

const Notification = mongoose.model("notifications", notifsSchema);

module.exports = Notification;