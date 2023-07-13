const { validationResult } = require('express-validator');
const logger = require('../../logger');
const votesService = require('../service/votes.service');

class VoteController {
  async add(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ message: 'Voting add validation error', errors });
      }

      const voteParams = {
        voterId: req.user.id,
        profileId: req.params.id,
        vote: req.query.vote,
      };
      const { error, user } = await votesService.addVote(voteParams);

      if (error) {
        return res.json({ message: error });
      }

      return res.json({ user, message: 'Vote successfully added' });
    } catch (error) {
      logger.error(`Adding vote error: ${error}`);
      return res.status(400).json({ message: `Adding vote error: ${error}` });
    }
  }

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ message: 'Voting update validation error', errors });
      }

      const voteParams = {
        voterId: req.user.id,
        profileId: req.params.id,
        vote: req.query.vote,
      };

      await votesService.updateVote(voteParams);

      return res.json({ message: 'Vote successfully updated' });
    } catch (error) {
      logger.error(`Updating vote error: ${error}`);
      return res.status(400).json({ message: `Updating vote error: ${error}` });
    }
  }

  async delete(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ message: 'Voting delete validation error', errors });
      }

      const voteParams = {
        voterId: req.user.id,
        profileId: req.params.id,
      };

      const { error } = await votesService.deleteVote(voteParams);

      if (error) {
        return res.json({ message: error });
      }

      return res.json({ message: 'Vote successfully deleted' });
    } catch (error) {
      logger.error(`Deleting vote error: ${error}`);
      return res.status(400).json({ message: `Deleting vote error: ${error}` });
    }
  }
}

module.exports = new VoteController();
