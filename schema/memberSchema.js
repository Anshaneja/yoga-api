const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  gender:{
    type: String,
  },
  age: {
    type: Number,
  },
  batch: {
    type: String,
  },
  lastPaymentMonth : {
    type : String,
  }
});

const MemberModel = new mongoose.model("members", memberSchema);

module.exports = MemberModel;
