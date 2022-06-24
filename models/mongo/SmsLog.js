const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  data: { type: Schema.Types.Mixed },
});

module.exports = mongoose.model('SmsLog', LogSchema, 'sms_log');
