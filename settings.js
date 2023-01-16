//reroute insecure requests
exports.enforceSSL = function(req, res, next) {
  if (req.secure){ return next(); }
  res.redirect("https://" + req.headers.host + req.url);
}
//customize logger
exports.logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      level: 'error',
      handleExceptions: true,
      format: winston.format.prettyPrint(),
    })
  ]
}).on('error', function (error) { /* catch */ });