const express = require('express');
const morgan = require('morgan');

const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

const server = express();

server.use(express.json()); //built-in middleware

server.use(morgan('dev'));


server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);


//endpoints
server.get('/', (req, res) => {
  res.send(`
  <h2>Let's write some middleware!</h2>
  `);
});

server.use(logger);

//custom middleware
//the three amigas
function logger(req, res, next) {
  console.log(req.url);
  console.log(
    `[${new Date().toString()}] ${req.method} to ${req.url} ${re.get(
      "Origin"
    )}`
  )
  next();
}

module.exports = server;
