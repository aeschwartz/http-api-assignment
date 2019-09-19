
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/unauthorized': jsonHandler.unauthorized,
  '/forbidden': jsonHandler.forbidden,
  '/internal': jsonHandler.internal,
  '/notImplemented': jsonHandler.notImplemented,
  notFound: jsonHandler.notFound,
};


const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url);

  const args = query.parse(parsedUrl.query);

  // add accept-type to args list bc easier
  Object.defineProperty(args, 'type', {
    value: req.headers.accept.split(',')[0],
    writable: false,
  });

  if (urlStruct[parsedUrl.pathname]) urlStruct[parsedUrl.pathname](req, res, args);
  else urlStruct.notFound(req, res, args);
};

http.createServer(onRequest).listen(port);

console.log(`Listening on localhost:${port}`);
