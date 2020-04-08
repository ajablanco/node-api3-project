const express = require('express');

const Users = require("./userDb.js");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const userInfo = req.body;
  Users.insert(userInfo)
  .then((user) => {
    res.status(201).json({success: true, user})
  })
  .catch((err) => {
    res.status(500).json({ message: "error error"})
  });
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  // do your magic!
  Posts.insert({ ...req.body, userid: req.params.id})
  .then(post => {
    res.status(201).json(post);
  })
  .catch((err) => {
    res.status(500).json({message: "error creating post"})
  })
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
  .then(users => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(500).json({message: "error could not be retrieved"})
  });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  req.user ? res.status(200).json(req.user)
  : res.status(500).json({
    message: "error retrieving user"
  });
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    res.status(500).json({message: "sorry bout it"})
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(500).json({message: "server errrorrr"});
  });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
  .then(user => {
    console.log(req);
    if (req.user.name !== req.body.name) {
      res.status(200).json({
        status: `Users' name ${req.user.name ? req.user.name : req.body.name} was updated to ${req.body.name}`,
        oldName: req.user.name,
        newName: req.body.name
      });
    } else {
      res.status(200).json({
        status:  `Users' name ${req.user.name} was unchanged`,
        oldName: req.user.name,
        newName: req.body.name
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: "error 505"})
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  Users.getById(id)
  .then((user) =>{
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({message: "invalid user id"});
    }
  })
  .catch((err) => {
    res.status(500).json({message: "505"});
  });
};

function validateUser(req, res, next) {
  // do your magic!
  const { name } = req.body;

  Object.entries(req.body).length === 0
  ? res.status(400).json({message: "missing user data"})
  : !name? res.status(400).json({message: "missing required name field"})
  : next();
}

function validatePost(req, res, next) {
  // do your magic!
  const { text } = req.body;
  Object.entries(req.body).length === 0
  ? res.status(400).json({message: "missing post data"})
  : !name? res.status(400).json({message: "missing requirements text field"})
  : next();
}

module.exports = router;
