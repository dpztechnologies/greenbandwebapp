const http = require("http");
const path = require('path');
const fs = require('fs').promises;
const dotenv = require('dotenv').config({ path: path.resolve(".env") });
const url = require('url');
const { MimeTypes, StaticFilePath } = require('../config/constants.cjs')
const querystring = require('querystring');
const Busboy = require('busboy');
const { pathToRegexp, match } = require('path-to-regexp');


/**
 * @author DPZTechnologies
 * @date Thu Apr 03 2025 15:17:25 GMT+0300 (East Africa Time)
 * @abstract Route Service Provider
 */
class RouteResolver {

  constructor() {
    this.routes = [];
    this.globalMiddlewares = [];
  }

  /**
   * Registers a global middleware function that will be applied to all incoming requests 
   * across all routes in the application. 
   * 
   * This middleware will be executed before any route-specific middleware and handler 
   * functions. It is useful for tasks that need to run for every request, such as 
   * logging, authentication, error handling, or modifying the request/response objects 
   * in a consistent way.
   * 
   * @param {Function} middleware - The middleware function to be registered globally. 
   *                                This function will be invoked for every incoming request.
   * 
   * @example
   * // Example usage for registering a global middleware
   * app.use(authenticationMiddleware);
   * app.use(loggingMiddleware);
   */
  use(middleware) {
    this.globalMiddlewares.push(middleware);
  }

  /**
  * Creates a new route by associating a path, HTTP method, middleware functions, and a handler function.
  * 
  * This method allows the registration of a new route that responds to a specified HTTP method (e.g., GET, POST) 
  * at a given path. The method accepts middleware functions that will be executed before the route handler is 
  * invoked. The handler is the final function that processes the request and sends the appropriate response.
  * 
  * It registers the route in the route table, including all associated middleware and the handler. The middlewares 
  * are executed in sequence, allowing for functionalities like authentication, logging, validation, etc., before 
  * the handler processes the request.
  * 
  * @param {string} path - The URL path for the route (e.g., '/api/users').
  * @param {string} method - The HTTP method that the route will handle (e.g., 'get', 'post').
  * @param {Function} handler - The function that handles the request and sends the response.
  * @param {Array<Function>} middlewares - An array of middleware functions that will be executed in sequence before the handler.
  * 
  * @example
  * // Example usage for adding a new route
  * router._addRoute('/login', 'post', loginHandler, [validateLoginData, logRequest]);
  */

  _addRoute(method, path, middlewares = [], handler) {
    const keys = [];
    const regexp = pathToRegexp(path, keys);
    this.routes.push({
      method: method.toLowerCase(),
      path,
      regexp,
      keys,
      middlewares,
      handler
    })
  }


  /**
   * Handles errors that occur during request processing.
   * 
   * This static method provides a centralized mechanism for error handling.
   * It logs the error to the server console and sends a structured JSON response
   * to the client containing the error message and, optionally, the stack trace.
   * 
   * The stack trace is included only when the environment is set to `development`
   * to avoid exposing sensitive information in production.
   * 
   * @param {Error} err - The error object that was thrown during execution.
   * @param {http.IncomingMessage} req - The incoming request object.
   * @param {http.ServerResponse} res - The outgoing response object used to send the error response.
   * 
   * @example
   * // Usage inside a middleware or route handler
   * try {
   *   throw new Error("Something went wrong");
   * } catch (err) {
   *   RouteResolver.handleError(err, req, res);
   * }
   */
  static handleError(err, req, res) {
    console.error('Error:', err); // Log error details for debugging
    res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: {
        message: err.message || 'Internal Server Error',
        stack: process.env.ENV === 'development' ? err.stack : undefined
      }
    }));
  }



  /**
  * Registers a new GET route with the specified path, middleware functions, and handler.
  * 
  * This method allows you to define a route that listens for GET requests at a specified path. 
  * You can attach one or more middleware functions to the route, which will be executed in sequence 
  * before the route handler is called. The handler function is the final function that processes 
  * the request and sends the response.
  * 
  * The method performs the following tasks:
  * - Registers the provided path and method (GET) in the route table.
  * - Associates any middleware functions to the route that will execute before the handler.
  * - The handler function processes the request and sends an appropriate response.
  * 
  * @param {string} path - The URL path for the GET route (e.g., '/api/users').
  * @param {Array<Function>} middlewares - An array of middleware functions that will be executed before the handler.
  * @param {Function} handler - The function that handles the request and sends the response for the route.
  * 
  * @example
  * // Example usage for registering a GET route with middlewares
  * router.get('/users', [authMiddleware, logRequestMiddleware], (req, res) => {
  *   res.send({ users: [] });
  * });
  */

  get(path, middlewares = [], handler) {
    this._addRoute('get', path, middlewares, handler);
  }

  /**
   * Register POST route
   * @param {string} path 
   * @param {Array<Function>} middlewares 
   * @param {Function} handler 
   */
  post(path, middlewares = [], handler) {
    this._addRoute('post', path, middlewares, handler);
  }



  /**
 * Handles the incoming request and outgoing response from the server.
 * This method processes the HTTP request, determines the requested URL and method (GET, POST, etc.),
 * and checks if the requested route exists. If the route is found, it invokes the appropriate middleware 
 * and handler. It also handles static file requests and parses the request body for POST requests.
 * 
 * The method performs the following tasks:
 * - Parses the URL of the incoming request and extracts the path and query parameters.
 * - Checks for static file requests based on the file extension and serves the file if found.
 * - For POST requests, it parses the request body based on the content type (e.g., JSON, form data).
 * - If the route is valid, it invokes any middleware functions and then calls the route handler.
 * - If no route is found, it responds with a 404 error.
 * 
 * @param {Request} req - The incoming request object containing data sent by the client.
 * @param {Response} res - The outgoing response object that will send the response to the client.
 * @returns {void} - Does not return a value. The response is sent directly to the client.
 * 
 * @example
 * // Example usage when handling a POST request to a specific route
 * await handleRequest(req, res);
 */

  async handleRequest(req, res) {
    const parsedURL = url.parse(req.url, true);
    const urlPath = parsedURL.pathname;
    const method = req.method.toLowerCase();
    const extname = path.extname(urlPath).toLowerCase();

    // Serve static file if extension matches
    if (Object.keys(MimeTypes).includes(extname)) {
      await this.serveStaticFile(urlPath, res);
      return;
    }

    // Parse POST body
    if (method === 'post') {
      await this.parseBody(req, res);
    }

    // Route matching with path-to-regexp
    const matchedRoute = this.routes.find(route => {
      const matcher = match(route.path, { decode: decodeURIComponent });
      const matched = matcher(urlPath);
      if (matched) {
        route._matched = matched;
        return route.method === method;
      }
      return false;
    });

    if (matchedRoute) {
      req.params = matchedRoute._matched.params || {};

      const allMiddlewares = [...this.globalMiddlewares, ...matchedRoute.middlewares];
      let i = 0;

      const next = () => {
        try {
          const middleware = allMiddlewares[i++];
          if (middleware) {
            middleware(req, res, next);
          } else {
            matchedRoute.handler(req, res);
          }
        } catch (err) {
          RouteResolver.handleError(err, req, res);
        }
      };

      next();
      return;
    }

    // No route matched
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid route / method' }));
  }

  /**
 * Serves static files (such as HTML, CSS, JavaScript, images, etc.) from the server.
 * The method attempts to retrieve the requested file from the server's file system and send it as a response.
 * If the file is found, it is served with the appropriate MIME type based on the file extension.
 * If the file is not found, a 404 error response is returned with a simple error message.
 * 
 * This function handles different file types and uses the `MimeTypes` mapping to determine the correct content type
 * for the file being served. It supports common static assets like HTML, CSS, JS, and image files.
 * 
 * @param {string} filePath - The relative path to the static file to be served.
 * @param {Response} res - The outgoing response object to which the file data will be written.
 * @returns {Promise} - A promise that resolves once the static file has been successfully served, or rejects if an error occurs.
 * 
 * @example
 * // Example usage for serving a static file
 * await serveStaticFile('/path/to/file.html', res);
 */

  async serveStaticFile(filePath, res) {
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MimeTypes[extname] || 'application/octet-stream'
    const fullFilePath = path.join(StaticFilePath, filePath);
    try {
      await fs.access(fullFilePath);
      const data = await fs.readFile(fullFilePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (err) {
      res.writeHead(404, { 'Content-type': 'text/html' });
      res.end('<h1>404 not found</h1>')
    }

  }


  /**
 * Parses the body of the incoming request based on its content type.
 * Supports parsing of multipart/form-data (using Busboy), application/json, and application/x-www-form-urlencoded formats.
 * 
 * If the request body is in JSON format, it will be parsed as a JavaScript object.
 * If the request body is in x-www-form-urlencoded format, it will be parsed into an object using querystring.parse().
 * If the request body is in multipart/form-data format, Busboy is used to handle the form fields and files (if any).
 * 
 * This method handles the request body parsing asynchronously and ensures that the appropriate data is available in the `req.body` object once parsing is complete.
 * 
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {Promise} - A promise that resolves when the body has been successfully parsed.
 * 
 * @example
 * // Example usage for handling a POST request with body parsing
 * await parseBody(req, res);
 */

  async parseBody(req, res) {
    const contentType = req.headers['content-type'];

    if (!contentType) {
      resolve();
      return;
    }

    return new Promise((resolve, reject) => {
      if (contentType.includes('multipart/form-data')) {
        const busboy = Busboy({ headers: req.headers });

        req.body = {};
        req.files = {};

        busboy.on('field', (fieldname, value) => {
          req.body[fieldname] = value;
        });

        busboy.on('finish', () => {
          resolve();
        });

        busboy.on('error', (err) => {
          console.error('Error parsing multipart form data:', err);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid multipart data' }));
          reject(err);
        });
        req.pipe(busboy);
      } else {
        let data = '';

        req.on('data', chunk => {
          data += chunk;
        });

        req.on('end', () => {
          try {
            switch (true) {
              case contentType.includes('application/json') && data:
                req.body = JSON.parse(data);
                return resolve();

              case contentType.includes('application/x-www-form-urlencoded'):
                req.body = querystring.parse(data);
                return resolve();

              default:
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unsupported content type' }));
                return reject(new Error('Unsupported content type'));
            }
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid data format" }));
            return reject(err);
          }
        });
      }
    });
  }



}

class RouteProvider {

  constructor() {
    this.port = process.env.PORT || 3000;
    this.router = new RouteResolver();
  }

  /**
 * Registers a middleware to be executed for all incoming requests.
 * Middleware functions are used to modify the request and/or response objects, 
 * perform tasks like logging, authentication, validation, etc., or terminate the request-response cycle.
 * 
 * This middleware will be applied globally, meaning it will be executed before processing any route-specific logic.
 * The middleware function must accept three arguments: `req`, `res`, and `next`. 
 * The `next` function is called to pass control to the next middleware or the route handler.
 * 
 * @param {Function} middleware - The middleware function to be registered. 
 *                                It should have the following signature: `function(req, res, next)`.
 *                                `req` is the request object, `res` is the response object, and `next` is a function to call the next middleware or handler.
 */

  use(middleware) {
    this.router.use(middleware);
  }

  /**
  * Handle GET requests for a specific route.
  * This method is used to define how GET requests for a given path are processed.
  * It allows you to specify any middleware functions that should be executed before the route handler.
  * After the middlewares have executed, the handler function is called to generate the response.
  *
  * @param {string} path - The path for which the GET request should be handled. 
  *                        This could be a simple path or a route pattern (e.g., "/users" or "/users/:id").
  * @param {Array<Function>} middleware - An array of middleware functions to be executed in order.
  *                                        Middleware functions are typically used for tasks like authentication, logging, request validation, etc.
  *                                        Each middleware takes three arguments: `req`, `res`, and `next`.
  * @param {CallableFunction} handler - The function that will be called once all middleware functions have been executed.
  *                                      This function receives the request (`req`) and response (`res`) objects as parameters and is responsible for sending the response back to the client.
  */

  get(path, middleware = [], handler) {
    this.router.get(path, middleware, handler);
  }

  /**
 * Handle POST requests for a specific route.
 * This method is used to define how POST requests for a given path are processed.
 * It allows you to specify any middleware functions that should be executed before the route handler.
 * After the middlewares have executed, the handler function is called to process the request and generate the response.
 *
 * @param {string} path - The path for which the POST request should be handled. 
 *                        This could be a simple path or a route pattern (e.g., "/submit" or "/create/:id").
 * @param {Array<Function>} middleware - An array of middleware functions to be executed in order.
 *                                        Middleware functions are typically used for tasks like data validation, authentication, or logging.
 *                                        Each middleware takes three arguments: `req`, `res`, and `next`.
 * @param {CallableFunction} handler - The function that will be called once all middleware functions have been executed.
 *                                      This function receives the request (`req`) and response (`res`) objects as parameters.
 *                                      The handler is responsible for processing the POST data (often through `req.body`) and sending the response back to the client.
 */

  post(path, middleware, handler) {
    this.router.post(path, middleware, handler);
  }

  /**
 * Starts the server and begins listening for incoming requests.
 * This method sets up an HTTP server that handles requests based on the routes and middlewares defined.
 * 
 * The server listens on the specified port (usually set via an environment variable or configuration) and responds to incoming requests.
 * It also logs a message indicating that the server is running and the URL where it can be accessed.
 * 
 * @example
 * // To start the server on port 3000
 * server.start();
 */

  start() {
    const Server = http.createServer(async (req, res) => {
      await this.router.handleRequest(req, res);
    })

    Server.listen(this.port, () => {
      console.log(`Server running on port ${this.port} http://localhost:${this.port}`)
    })
  }

}

/**
 * Get RouteProvider instance
 * @returns {RouteProvider} a route provider instance
 */
function routeProvider() {
  return new RouteProvider();
}


module.exports = { routeProvider };






