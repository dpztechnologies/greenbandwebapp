const http = require("http");
const path = require('path');
const fs = require('fs').promises;
const dotenv = require('dotenv').config({ path: path.resolve("../.env") });
const url = require('url');
const { MimeTypes, StaticFilePath } = require('./constants.cjs')


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
    //Check if request is a static file ie (css, js)
    const extname = path.extname(urlPath).toLowerCase();
    if (Object.keys(MimeTypes).includes(extname)) {
      await this.serveStaticFile(urlPath, res);
      return;
    }
    //Verify route exists and call method handler
    if (this.routes[urlPath] && this.routes[urlPath][method]) {
      //Call urlPath handler
      this.routes[urlPath][method](req, res);
    } else {
      //Return a 404 message if route is invalid
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
    //Resolve path to file
    const fullFilePath = path.join(StaticFilePath, filePath);
    try {
      //Check file exists
      await fs.access(fullFilePath);
      //Read and serve file if exists
      const data = await fs.readFile(fullFilePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (err) {
      //File does not exist throw an error
      res.writeHead(404, { 'Content-type': 'text/html' });
      res.end('<h1>404 not found</h1>')
    }

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






