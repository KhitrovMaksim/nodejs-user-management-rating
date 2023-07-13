const { Schema, model } = require('mongoose');

const VotesModel = new Schema({
  voter: { type: String, required: true },
  profile: { type: String, required: true },
  vote: { type: Number, required: true },
});

module.exports = model('Votes', VotesModel);
