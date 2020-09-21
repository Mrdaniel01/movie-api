const express = require('express');
const passport = require('passport');
const MoviesService = require('../services/movies')

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler')
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler')

const cacheResponse = require('../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/time');

//JWT Strategy
require('../utils/auth/strategies/jwt') 

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  router.get('/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['read:movies']),
    async function(req, res, next){
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    const { tags } = req.query;
    try {
      const movies = await moviesService.getMovies({ tags });
      //throw new Error('Error') // simular error, probar midleware
      res.status(200).json({
        data: movies,
        message: 'movies listed'
      })
    } catch (error) {
      next(error)
    }
  });
  
  router.get('/:movieId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler({movieId: movieIdSchema}, 'params'), 
    async function(req, res, next){
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
      const { movieId } = req.params;
    try {
      const movies = await moviesService.getMovie({ movieId });

      res.status(200).json({
        data: movies,
        message: 'movie retrieved'
      })
    } catch (error) {
      next(error)
    }
  });
  
  router.post('/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema), 
    async function(req, res, next){
    const { body: movie } = req;
    try {
      const createMovieId = await moviesService.createMovie({ movie });

      res.status(200).json({
        data: createMovieId,
        message: 'movies created'
      })
    } catch (error) {
      next(error)
    }
  });

  router.put('/:movieId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({movieId: movieIdSchema}, 'params'),
    validationHandler(updateMovieSchema), async function(req, res, next){
    const { movieId } = req.params;
    const { body: movie } = req;
    try {
      const updatedMovieId = await moviesService.updateMovie({ movieId, movie });

      res.status(200).json({
        data: updatedMovieId,
        message: 'movie updated'
      })
    } catch (error) {
      next(error)
    }
  });

  // router.patch('/:movieId', async function(req, res, next){
  //   const { movieId } = req.params;
  //   const { body: movie } = req;
  //   try {
  //     const patchedMovieId = await moviesService.updateMovie({ movieId, movie });

  //     res.status(200).json({
  //       data: patchedMovieId,
  //       message: 'resource Updated'
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // });

  router.delete('/:movieId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:movies']),
    validationHandler({movieId: movieIdSchema}), async function(req, res, next){
    const { movieId } = req.params;
    try {
      const deletedMovieId = await moviesService.deleteMovie({ movieId });

      res.status(200).json({
        data: deletedMovieId,
        message: 'movie deleted'
      })
    } catch (error) {
      next(error)
    }
  });

}

module.exports = moviesApi;