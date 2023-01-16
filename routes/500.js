module.exports = function (logger) {
  return function errorHandler(err, req, res, next) {
    logger.error('Error Handler', err);
    res.status(500);
    res.render(Error_page);
  }
}