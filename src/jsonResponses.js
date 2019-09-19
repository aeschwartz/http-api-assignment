const messages = {
  200: 'Success',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  501: 'Not Implemented',
};

const respond = (res, status, type) => {
  // eslint doesn't love me :(
  // if (!type.includes('xml') && !type.includes('json')) type = 'application/json';

  res.writeHead(status, { 'Content-Type': type });

  switch (type) {
    case 'application/xml':
    case 'text/xml':
      res.writeHead(status, { 'Content-Type': type });
      res.write(`<response><message>${messages[status]}</message><id>${status}</id></response>`);
      break;
    case 'application/json':
    default:
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(
        {
          message: messages[status],
          id: status,
        },
      ));
      break;
  }

  res.end();
};

const success = (req, res, args) => {
  respond(res, 200, args.type);
};

const badRequest = (req, res, args) => {
  if (args.valid) respond(res, 200, args.type);
  else respond(res, 400, args.type);
};

const unauthorized = (req, res, args) => {
  if (args.loggedIn === 'yes') respond(res, 200, args.type);
  else respond(res, 401, args.type);
};

const forbidden = (req, res, args) => {
  respond(res, 403, args.type);
};

const internal = (req, res, args) => {
  respond(res, 500, args.type);
};

const notImplemented = (req, res, args) => {
  respond(res, 501, args.type);
};

const notFound = (req, res, args) => {
  respond(res, 404, args.type);
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
