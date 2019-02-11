require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = {
  Query: {
    async user(_, {}, { user }) {
      if (!user) {
        throw new Error('You are not logged in');
      }

      return user;
    },
  },

  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '5y' }
      );
    },

    async createUser(_, { name, email, password }) {
      return await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });
    },
  },

  User: {
    async group(user) {
      return await user.getGroup();
    },
  },
};
