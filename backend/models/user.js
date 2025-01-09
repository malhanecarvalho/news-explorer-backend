const mongoose = require("mongoose");
const validator = require("validator");
const isEmail = require('validator/lib/isEmail');
const { validateHash } = require('../utils/hash');
const { BadRequestError } = require("../utils/errors/apiError");
const { required } = require("joi");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Wrong email format',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  username: {
    type: String,
    minlength: 2,
    maxlength: 7,
  },

});

userSchema.statics.findUserByCredentials = function (email, password, username) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new BadRequestError({ statusCode: 400, message: 'Senha ou e-mail incorreto' });
      }
      return {validateHash: validateHash(password, user.password), username, user}
    });
};

module.exports = mongoose.model('user', userSchema);