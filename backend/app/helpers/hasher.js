const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.saltRounds = saltRounds;
exports.hash = bcrypt.hash;
exports.compare = bcrypt.compare;