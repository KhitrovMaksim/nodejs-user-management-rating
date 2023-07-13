const User = require('../models/user.model');
const Votes = require('../models/votes.model');
const userService = require('./user.service');
const { HOUR } = require('../../config');
const UserDto = require('../dtos/user.dto');

class VotesService {
  async addVote(voteParams) {
    const { profileId, voterId, vote } = voteParams;

    const profile = await User.findOne({ _id: profileId });
    const voter = await User.findOne({ _id: voterId });

    const profileDto = new UserDto(profile);
    const voterDto = new UserDto(voter);

    if (voterDto.id === profileDto.id) {
      return { error: 'You can not vote for themselves' };
    }

    const isVotedForSameProfile = await Votes.findOne({
      voter: voterDto.id,
      profile: profileDto.id,
    });

    if (isVotedForSameProfile) {
      return { error: 'You can not vote twice for the same profile.' };
    }

    if (voterDto.lastVote) {
      const { lastVote } = voterDto;
      const toDay = new Date();

      if (toDay.getTime() - lastVote.getTime() < HOUR) {
        return { error: 'You can vote only one time per hour.' };
      }
    }

    await userService.updateLastVote(voterDto.id, new Date().toISOString());

    const votes = new Votes({
      voter: voterDto.id,
      profile: profileDto.id,
      vote: vote === 'increment' ? 1 : -1,
    });

    await votes.save();

    return { error: null, profile };
  }

  async updateVote(voteParams) {
    const { profileId, voterId, vote } = voteParams;

    await Votes.findOneAndUpdate(
      { voter: voterId, profile: profileId },
      { vote: vote === 'increment' ? 1 : -1 },
    );
  }

  async deleteVote(voteParams) {
    const { profileId, voterId } = voteParams;

    const { deletedCount } = await Votes.deleteOne({
      voter: voterId,
      profile: profileId,
    });

    if (deletedCount === 0) {
      return { error: 'You do not vote for that profile' };
    }

    return { error: null };
  }
}

module.exports = new VotesService();
