const http = require("http");
const path = require('path');
const fs = require('fs').promises;
const dotenv = require('dotenv').config({ path: path.resolve("../.env") });
const url = require('url');
const { MimeTypes, StaticFilePath } = require('../config/constants.cjs')
const querystring = require('querystring');
const Busboy = require('busboy');


/**
 * @author DPZTechnologies
 * @date Thu Apr 03 2025 15:17:25 GMT+0300 (East Africa Time)
 * @abstract Route Service Provider
 */
class RouteResolver {

  constructor() {
    this.routes = {};
  }

  /**
   * Create a new route
   * @param {string} path 
   * @param {string} method 
   * @param {CallableFunction} handler 
   */
  addRoute(path, method, handler) {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }
    this.routes[path][method.toLowerCase()] = handler
  }

  /**
   * Handles Request and response from server
   * @param {Request} req 
   * @param {Response} res 
   */
  async handleRequest(req, res) {
    const parsedURL = url.parse(req.url, true);
    const urlPath = parsedURL.pathname;
    const method = req.method.toLowerCase();
    const extname = path.extname(urlPath).toLowerCase();
    if (Object.keys(MimeTypes).includes(extname)) {
      await this.serveStaticFile(urlPath, res);
      return;
    }

    if (method === 'post') {
      await this.parseBody(req, res);
    }

    if (this.routes[urlPath] && this.routes[urlPath][method]) {
      this.routes[urlPath][method](req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid route / method' }))
    }
  }

  /**
    * Serve static files (HTML, CSS, JS, etc.)
    * @param {string} filePath
    * @param {Response} res
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
   * Handles multipart/form-data using Busboy, as well as JSON and x-www-form-urlencoded formats.
   * 
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The outgoing response object.
   * @returns {Promise} - A promise that resolves when the body has been successfully parsed.
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
    this.port = process.env.PORT;
    this.router = new RouteResolver();
  }

  /**
   * Handle get requests
   * @param {string} path 
   * @param {CallableFunction} handler 
   */
  get(path, handler) {
    this.router.addRoute(path, 'get', handler);
  }

  /**
   * Handle post requests
   * @param {String} path 
   * @param {CallableFunction} handler 
   */
  post(path, handler) {
    this.router.addRoute(path, 'post', handler);
  }

  /**
   * Start server
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






