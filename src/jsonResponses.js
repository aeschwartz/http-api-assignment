const ids = {
  400: 'badRequest',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  500: 'internalError',
  501: 'notImplemented',
};

const respond = (res, status, message, type) => {
  // eslint doesn't love me :(
  // if (!type.includes('xml') && !type.includes('json')) type = 'application/json';

  // type needs to be moderated, so it is set inside the switch instead of here
  // res.writeHead(status, { 'Content-Type': type });

  switch (type) {
    case 'application/xml':
    case 'text/xml':
      res.writeHead(status, { 'Content-Type': type });
      res.write(`<response><message>${message}</message>${status === 200 ? '' : `<id>${ids[status]}</id></response>`}`);
      break;
    case 'application/json':
    default:
      res.writeHead(status, { 'Content-Type': 'application/json' });
      const json = 
      res.write(JSON.stringify(
        status === 200 ? { message } : 
        {
          message,
          id: ids[status],
        }
        ));
      break;
  }

  res.end();
};

const success = (req, res, args) => {
  respond(res, 200, 'This is a successful response', args.type);
};

const badRequest = (req, res, args) => {
  if (args.valid === 'true') respond(res, 200, 'This request has the required parameters', args.type); // have to do === 'true' bc value is string, not boolean
  else respond(res, 400, 'Missing valid query parameter set to true', args.type);
};

const unauthorized = (req, res, args) => {
  if (args.loggedIn === 'yes') respond(res, 200, 'You have successfully viewed the content', args.type);
  else respond(res, 401, 'Missing loggedIn query parameter set to yes', args.type);
};

const forbidden = (req, res, args) => {
  respond(res, 403, 'You do not have access to this content', args.type);
};

const internal = (req, res, args) => {
  respond(res, 500, 'Internal Server Error. Something went wrong.', args.type);
};

const notImplemented = (req, res, args) => {
  respond(res, 501, 'A GET request for this page has not been implemented yet. Check again later for updated content.', args.type);
};

const notFound = (req, res, args) => {
  respond(res, 404, 'The page you are looking for was not found.', args.type);
};
module.exports = {
  respond,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
