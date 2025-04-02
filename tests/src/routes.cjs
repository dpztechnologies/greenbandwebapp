const http = require("http");
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve("../../.env") });
const fs = require('fs');

const port = process.env.PORT;

http.createServer((req, res) => {
    if(req.url === 'req')
    res.end();
}).listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});


class Route {
  constructor(){
    
  }
}
//app.get('/', callback)
