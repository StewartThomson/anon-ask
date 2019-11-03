const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminIdLogSchema = new Schema({
  workspace_id: String,
  admin_ids: [String]
});

module.exports = mongoose.model("AdminIdLog", adminIdLogSchema);
