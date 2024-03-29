const mongoose = require('mongoose');
const { formatTimeStamp } = require('../utils/dateUtils');
const { Schema } = mongoose;

// Reaction schema for the nested array
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => formatTimeStamp(timestamp),
  },
},
{ _id: false }); // Prevent generating a separate `_id` for reactions

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => formatTimeStamp(timestamp),
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
},
{ timestamps: true }); // Automatically manage `createdAt` and `updatedAt`

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
