const User = require('../models/user.model');
const Role = require('../models/role.model');
const getHashedPassword = require('../../lib/helpers/getHashedPassword');
const UserDto = require('../dtos/user.dto');
const tokenService = require('./token.service');
const roles = require('../enum/roles');

class UserService {
  async registration(newUser) {
    const hashedPassword = getHashedPassword(newUser.password);

    const candidate = await User.findOne({ nickname: newUser.nickname });
    if (candidate) {
      throw new Error('User already exist');
    }

    const userRole = await Role.findOne({ role: roles.user });
    const user = new User({
      nickname: newUser.nickname,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      password: hashedPassword,
      role: userRole.role,
    });

    await user.save();

    return user;
  }

  async getUsers(page, limit) {
    const users = await User.find();
    if (!users) {
      return 'The list of users is empty';
    }
    if (!page || !limit) {
      return users;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = users.slice(startIndex, endIndex);

    return {
      totalUsers: users.length,
      currentPage: page,
      totalPages: Math.ceil(users.length / limit),
      users: result,
    };
  }

  async login(nickname, password) {
    const user = await User.findOne({ nickname });

    if (!user) {
      return { error: 'User not exist', user };
    }

    const userDto = new UserDto(user);
    const hashedPassword = getHashedPassword(password);

    if (hashedPassword !== userDto.password) {
      return { error: 'Password incorrect', user };
    }

    const token = tokenService.generateToken({ ...userDto });
    return { token, userDto };
  }

  async update(newData, unmodifiedSince) {
    const user = await User.findOne({ _id: newData.id });

    if (!user) {
      return { error: 'User not exist', user };
    }

    if (unmodifiedSince.getTime() < user.updated_at.getTime()) {
      return { error: 'Precondition Failed', user };
    }

    const userData = new UserDto(user);

    if (newData.nickname) {
      const candidate = await User.findOne({ nickname: newData.nickname });
      if (candidate) {
        return { error: `User with nickname ${newData.nickname} already exist`, userData };
      }
    }

    const newUserData = {
      nickname: !newData.nickname ? userData.nickname : newData.nickname,
      password: !newData.password ? userData.password : getHashedPassword(newData.password),
      firstname: !newData.firstname ? userData.firstname : newData.firstname,
      lastname: !newData.lastname ? userData.lastname : newData.lastname,
      updated_at: new Date().toISOString(),
    };

    await User.updateOne({ _id: newData.id }, newUserData);
    return { error: null, userData: newUserData };
  }

  async delete(userId) {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return { error: 'User not exist', user };
    }

    if (user.deleted_at) {
      return { error: 'User already deleted', user };
    }

    const userData = new UserDto(user);

    const newUserData = {
      updated_at: new Date().toISOString(),
      deleted_at: new Date().toISOString(),
    };

    await User.updateOne({ _id: userId }, newUserData);
    return { error: null, userData };
  }
}

module.exports = new UserService();
