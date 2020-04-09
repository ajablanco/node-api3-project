const express = require('express');

const router = express.Router();

const Posts = require("./postDb");

router.get('/', (req, res) => {
  // do your magic!
  Posts.get(req.query)
  .then((posts) => {
    res.status(200).json(posts)
  })
  .catch((error) => {
    res.status(500).json({
      message: 'Error'
    });
  });
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.getById(req.params.id)
  .then((post) => {
    res.status(200).json(post);
  })
  .catch((error) => {
    res.status(500).json({message: "error error"});
  });
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.params.id)
  .then((count) => {
    if (count > 0) {
      res.status(200).json({message: "post has been deleted"})
    } else{
      res.status(400).json({message: 'cannot find post'})
    }
  })
  .catch((error) => {
    res.status(500).json({message: "server error"});
  });
});

router.put('/:id', [validatePost, validatePostId], (req, res) => {
  // do your magic!
  const { id } = req.params;

  Posts.update(id, req.body)
  .then(()=> {
    res.status(200).json({success: "updated successfully", info: req.body})
  })
  .catch((error) => {
    res.status(500).json({message: "nope"});
  });
});

// custom middleware
function validatePost(req, res, next) {
  const { text } = req.body;

  Object.entries(req.body).length === 0
  ? res.status(400).json({message: "No data"})
  : !text
  ? res.status(400).json({message: "missing requirements"})
  : next();

}

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Posts.getById(id)
  .then((post) => {
    if (post) {
      req.post = post;
      next();
  } else {
    res.staus(404).json({message: "invalid"})
  }
  })
  .catch((err) => {
    res.status(500).json({message: "server noped"})
  });
}

module.exports = router;
