module.exports = function (app) {
  app.all('*', function (req, res, next) {
    res.render(Not_Found_Page)
  });
}