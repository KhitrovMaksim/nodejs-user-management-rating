const User = require('../models/user.model');
const Votes = require('../models/votes.model');
const userService = require('./user.service');

class VotesService {
  async addVote(userData, voteParams) {
    const { userProfileId, vote } = voteParams;

    if (!userProfileId || !vote) {
      return { error: 'Please add params' };
    }

    if (vote !== 'increment' && vote !== 'decrement') {
      return {
        error: 'Please enter valid parameter for property vote (e.x. increment or decrement)',
      };
    }

    const profile = await User.findOne({ _id: userProfileId }).catch(() => null);
    const voter = await User.findOne({ _id: userData.id }).catch(() => null);

    if (!profile) {
      return { error: `You can not vote for user with id: ${userProfileId} that does not exist` };
    }

    if (voter.id === profile.id) {
      return { error: 'You can not vote for themselves' };
    }

    const isVotedForSameProfile = await Votes.findOne({
      voter: voter.id,
      profile: profile.id,
    }).catch((error) => ({ error }));

    if (isVotedForSameProfile) {
      return { error: 'You can not vote twice for the same profile.' };
    }

    if (voter.last_vote) {
      const lastVote = voter.last_vote;
      const toDay = new Date();

      if (toDay.getTime() - lastVote.getTime() < 3600000) {
        return { error: 'You can vote only one time per hour.' };
      }
    }

    await userService.updateLastVote(userData, new Date().toISOString());

    const votes = new Votes({
      voter: userData.id,
      profile: userProfileId,
      vote: vote === 'increment' ? 1 : -1,
    });

    await votes.save().catch((error) => ({ error }));

    return { error: null, profile };
  }

  async updateVote(userData, voteParams) {
    const { userProfileId, vote } = voteParams;

    if (!userProfileId || !vote) {
      return { error: 'Please add params' };
    }

    const { matchedCount } = await Votes.updateOne(
      { voter: userData.id, profile: userProfileId },
      { vote: vote === 'increment' ? 1 : -1 },
    ).catch((error) => ({ error }));

    if (matchedCount === 0) {
      return { error: 'You do not vote for that profile' };
    }

    return { error: null };
  }

  async deleteVote(userData, userProfileId) {
    const { deletedCount } = await Votes.deleteOne({
      voter: userData.id,
      profile: userProfileId,
    }).catch((error) => ({ error }));

    if (deletedCount === 0) {
      return { error: 'You do not vote for that profile' };
    }

    return { error: null };
  }
}

module.exports = new VotesService();
