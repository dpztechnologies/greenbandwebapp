const Path = require('./path.cjs');

/*
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
APP CONSTANTS
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
*/

/**
 * Defines a default mininum random number Value
 */
const MinRandom = 1000;

/**
 * Defines a default maximum random number Value
 */
const MaxRandom = 10000;

/**
 * Defines all file paths with file names as keys
 */
const FilePaths = {
    login: Path.getFile(Path.getParentDir(__dirname, 1), 'public', 'views', 'pages', 'guest', 'login.html'),
}


/**
 * Path to the 'public' directory, one level up from current directory i,e Static file path 
 */
const StaticFilePath = Path.getFile(Path.getParentDir(__dirname, 1), 'public');

/**
 * MIME types for different file extensions  
 */
const MimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.ttf': 'font/ttf',
    '.ico': 'image/x-icon'
}


module.exports = { MinRandom, MaxRandom, FilePaths, MimeTypes, StaticFilePath };


