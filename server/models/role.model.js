const { Schema, model } = require('mongoose');
const roles = require('../enum/roles');

const RoleModel = new Schema({
  role: { type: String, unique: true, enum: Object.values(roles) },
});

module.exports = model('Role', RoleModel);
