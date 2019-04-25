const { Router } = require('express');
const Post = require('../models/Post');
const { ensureAuth } = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, async(req, res, next) => {
    const { user, photoUrl, caption, hashtags } = req.body;
    const authUser = req.user;

    if(authUser._id !== user){
      const error = new Error('Dont be a JERKK!, you poser');
      error.status = 401;
      next(error);
    }
    
    try {
      const post = await Post.create({ user, photoUrl, caption, hashtags });
      res.send(post);
    } catch(error) {
      next(error);
    }
  })
  .get('/', async(req, res, next) => {
    try {
      const posts = await Post
        .find();
      res.send(posts);
    }
    catch(error) {
      next(error);
    }
  })
  .get('/:id', async(req, res, next) => {
    const { id } = req.params;
    try { 
      const post = await Post
        .findById(id);
      res.send(post);
    }
    catch(error) {
      next(error);
    } 
  })
  .patch('/:id', ensureAuth, async(req, res, next) => {
    const { caption } = req.body;
    const { id } = req.params;
    try {
      const post = await Post
        .findByIdAndUpdate(id, { caption }, { new: true });
      res.send(post);
    }
    catch(error) {
      next(error);
    }
  });
