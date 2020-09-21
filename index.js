const express = require('express');
const helmet = require("helmet");
const app = express();

const { config } = require('./config/index')

const authApi = require('./routes/auth')
const moviesApi = require('./routes/movies')
const userMoviesApi = require('./routes/userMovies')


const { 
  logErrors,
  errorHandler,
  wrapErrors  
} = require('./utils/middleware/errorHandlers')

const notFoundHandler = require('./utils/middleware/notFoundHandler');

//body parser middlewaare
app.use(express.json())
app.use(helmet())

//routes
authApi(app)
moviesApi(app);
userMoviesApi(app);

//catch 404
app.use(notFoundHandler);

//Errors handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function() {
  console.log(`listening on http://localhost:${config.port}`);
  });
