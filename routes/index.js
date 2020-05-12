'use strict';

const { Router } = require('express');
const router = new Router();

router.get('/', (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    res.redirect('/post/list');
  } else {
    res.render('index', { title: 'Hello World!' });
  }
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
