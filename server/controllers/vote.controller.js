const logger = require('../../logger');
const votesService = require('../service/votes.service');

class VoteController {
  async add(req, res) {
    try {
      const voteParams = {
        userProfileId: req.params.id,
        vote: req.query.vote,
      };

      const { error, user } = await votesService.addVote(req.user, voteParams);

      if (error) {
        return res.json({ message: error });
      }

      return res.json({ user, message: 'Vote successfully added' });
    } catch (error) {
      logger.error(`Adding vote error: ${error}`);
      return res.status(400).json({ message: 'Adding vote error' });
    }
  }

  async update(req, res) {
    try {
      const voteParams = {
        userProfileId: req.params.id,
        vote: req.query.vote,
      };

      const { error } = await votesService.updateVote(req.user, voteParams);

      if (error) {
        return res.json({ message: error });
      }

      return res.json({ message: 'Vote successfully updated' });
    } catch (error) {
      logger.error(`Updating vote error: ${error}`);
      return res.status(400).json({ message: 'Updating vote error' });
    }
  }

  async delete(req, res) {
    try {
      const { error } = await votesService.deleteVote(req.user, req.params.id);

      if (error) {
        return res.json({ message: error });
      }

      return res.json({ message: 'Vote successfully deleted' });
    } catch (error) {
      logger.error(`Deleting vote error: ${error}`);
      return res.status(400).json({ message: 'Deleting vote error' });
    }
  }
}

module.exports = new VoteController();
