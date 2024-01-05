import express from 'express';
import ThoughtController from '../controllers/thought-controller';

const router = express.Router();

// /api/thoughts
router.route('/')
  .get(ThoughtController.getAllThoughts)
  .post(ThoughtController.createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
  .get(ThoughtController.getThoughtById)
  .put(ThoughtController.updateThought)
  .delete(ThoughtController.deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
  .post(ThoughtController.createReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId')
  .delete(ThoughtController.deleteReaction);

export default router;
