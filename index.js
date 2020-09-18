const express = require('express');
const app = express();

const { config } = require('./config/index')
const moviesApi = require('./routes/movies')

const { 
  logErrors,
  errorHandler,
  wrapErrors  
} = require('./utils/middleware/errorHandlers')

const notFoundHandler = require('./utils/middleware/notFoundHandler');

//body parser middlewaare
app.use(express.json())

//routes
moviesApi(app);

//catch 404
app.use(notFoundHandler);

//Errors handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function() {
  console.log(`listening on http://localhost:${config.port}`);
  });
