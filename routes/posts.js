const express = require('express');
const Post = require('./../models/post');
const Comment = require('./../models/comment');
const multer = require('multer');
const postRouter = new express.Router();
const routeGuard = require('./../middleware/route-guard');

const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

postRouter.get('/create', routeGuard, (req, res, next) => {
  res.render('./posts/create');
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'april-2020',
});

const uploader = multer({ storage });

postRouter.post('/create', uploader.single('picture'), (req, res, next) => {
  const postDetails = {
    content: req.body.content,
    pictureName: req.body.pictureName,
    pictureUrl: req.file.url,
    creatorId: req.user,
  };
  Post.create({
    content: postDetails.content,
    pictureName: postDetails.pictureName,
    pictureUrl: postDetails.pictureUrl,
    creatorId: postDetails.creatorId,
  })
    .then((post) => {
      res.redirect(`/post/list`);
    })
    .catch((err) => {
      next(err);
    });
});

postRouter.get('/list', routeGuard, (req, res, next) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate('creatorId')
    .then((posts) => {
      console.log(posts);
      res.render('./posts/list', { posts });
    })
    .catch((error) => {
      next(error);
    });
});

postRouter.get('/view/:id', (req, res, next) => {
  const postId = req.params.id;
  Post.findById(postId)
    .populate('creatorId')
    .populate('comments.creatorId')
    .then((post) => {
      res.render('./posts/single', { post });
    })
    .catch((error) => {
      next(error);
    });
});

postRouter.get('/view/:id/comments', (req, res, next) => {
  const postId = req.params.id;
  Comment.find()
    .then((document) => {
      let comment = document;
      res.render('./posts/single', { post });
    })
    .catch((error) => {
      next(error);
    });
});

postRouter.post(
  '/:id/comment/create',
  uploader.single('picture'),
  (req, res, next) => {
    const postId = req.params.id;
    console.log(postId);
    const commentDetails = {
      content: req.body.content,
      pictureName: req.body.pictureName,
      creatorId: req.user,
    };
    const pictureUrl = '';
    if (req.file) {
      pictureUrl = req.file.url;
    }
    Comment.create({
      content: commentDetails.content,
      pictureName: commentDetails.pictureName,
      pictureUrl: pictureUrl,
      creatorId: commentDetails.creatorId,
    })
      .then((document) => {
        let comment = document;
        return Post.findByIdAndUpdate(postId, { $push: { comments: comment } });
      })
      .then((post) => {
        res.redirect(`/post/view/${postId}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = postRouter;
