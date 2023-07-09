const { Schema, model } = require('mongoose');
const roles = require('../enums/roles');

const RoleModel = new Schema({
  role: { type: String, unique: true, enum: Object.values(roles) },
});

module.exports = model('Role', RoleModel);
