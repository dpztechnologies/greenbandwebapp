const http = require("http");
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve("../../.env") });
const fs = require('fs');
const url = require('url');
const port = process.env.PORT;

// http.createServer((req, res) => {
//     if(req.url === 'req')
//     res.end();
// }).listen(port, () => {
//     console.log(`Listening on http://localhost:${port}`);
// });


class Router {

  constructor() {
    this.routes = {};
  }

  /**
   * Register routes & Route handlers
   */
  addRoute(path, method, handler) {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }
    this.routes[path][method.toLowerCase()] = handler
  }

  /**
   * Handle request by matching path and method
   */
  handleRequest(req, res) {
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const method = req.method.toLowerCase();

    //Verify route exists and call method handler
    if (this.routes[path] && this.routes[path][method]) {
      //Call path handler
      this.routes[path][method](req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid route / method' }))
    }
  }

}


class Server {

  constructor() {
    this.port = process.env.PORT
    this.router = new Router();
  }


  /**
   * Add route to server
   */
  addRoute(path, method, handler) {
    this.router.addRoute(path, method, handler)
  }

  /**
   * Start server
   */

  start() {
    const Server = http.createServer((req, res) => {
      this.router.handleRequest(req, res);
    })

    Server.listen(this.port, () => {
      console.log(`Server running on port ${this.port} http://localhost:${port}`)
    })
  }
}



const server = new Server();

function getHomePage(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('Welcome to the home page');
}


server.addRoute('/', 'GET', getHomePage);

server.start();

//app.get('/', callback)
