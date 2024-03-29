const { Thought, User } = require('./models'); // Import the Thought and User models

const ThoughtController = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (error) {
      console.error('Server error. Could not retrieve thoughts:', error);
      res.status(500).json({ error: 'Server error. Could not retrieve thoughts.' });
    }
  },

  getThoughtById: async (req, res) => {
    const { thoughtId } = req.params;

    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found.' });
      }
      res.json(thought);
    } catch (error) {
      console.error('Server error. Could not retrieve the thought:', error);
      res.status(500).json({ error: 'Server error. Could not retrieve the thought.' });
    }
  },

  createThought: async (req, res) => {
    const { thoughtText, username, userId } = req.body;

    // Validate required fields
    if (!thoughtText || !username || !userId) {
      return res.status(400).json({ error: 'Missing required fields. Cannot create the thought.' });
    }

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: 'User does not exist. Cannot create the thought.' });
      }

      const newThought = await Thought.create({ thoughtText, username });
      await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } });

      res.status(201).json(newThought);
    } catch (error) {
      console.error('Server error. Could not create the thought:', error);
      res.status(500).json({ error: 'Server error. Could not create the thought.' });
    }
  },

  updateThought: async (req, res) => {
    const { thoughtId } = req.params;
    const { thoughtText } = req.body;

    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { thoughtText },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ error: 'Thought not found.' });
      }

      res.json(updatedThought);
    } catch (error) {
      console.error('Server error. Could not update the thought:', error);
      res.status(500).json({ error: 'Server error. Could not update the thought.' });
    }
  },

  deleteThought: async (req, res) => {
    const { thoughtId } = req.params;

    try {
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);

      if (!deletedThought) {
        return res.status(404).json({ error: 'Thought not found.' });
      }

      res.json({ message: 'Thought deleted successfully.' });
    } catch (error) {
      console.error('Server error. Could not delete the thought:', error);
      res.status(500).json({ error: 'Server error. Could not delete the thought.' });
    }
  },

  createReaction: async (req, res) => {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    // Validate required fields
    if (!reactionBody || !username) {
      return res.status(400).json({ error: 'Missing required fields. Cannot add reaction.' });
    }

    try {
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ error: 'Thought not found.' });
      }

      const userExists = await User.exists({ username });

      if (!userExists) {
        return res.status(400).json({ error: 'Invalid username. Cannot add reaction.' });
      }

      const newReaction = {
        reactionBody,
        username,
      };

      thought.reactions.push(newReaction);

      const updatedThought = await thought.save();

      res.json(updatedThought);
    } catch (error) {
      console.error('Server error. Could not add reaction:', error);
      res.status(500).json({ error: 'Server error. Could not add reaction.' });
    }
  },

  deleteReaction: async (req, res) => {
    const { thoughtId, reactionId } = req.params;

    try {
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ error: 'Thought not found.' });
      }

      const existingReaction = thought.reactions.id(reactionId);

      if (!existingReaction) {
        return res.status(404).json({ error: 'Reaction not found.' });
      }

      thought.reactions.pull({ _id: reactionId });

      const updatedThought = await thought.save();

      res.json(updatedThought);
    } catch (error) {
      console.error('Server error. Could not delete reaction:', error);
      res.status(500).json({ error: 'Server error. Could not delete reaction.' });
    }
  }
};

module.exports = ThoughtController;

