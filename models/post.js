const mongoose = require('mongoose');
const Comment = require('./comment');

const postSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
    pictureUrl: {
      type: String,
    },
    pictureName: {
      type: String,
    },
    comments: {
      type: [Comment.schema],
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
