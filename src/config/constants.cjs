const Path = require('../modules/path.cjs');

/*
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
APP CONSTANTS
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
*/

/*
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
RANDOM NUMBER CONSTANTS
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

/*
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
FILE & FILE PATH CONSTANTS
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
*/

/**
 * Defines the apps root directory
 */
const RootDir = Path.getParentDir(__dirname, 2)

/**
 * Path to the 'public' directory, one level up from current directory i,e Static file path 
 */
const StaticFilePath = Path.getFile(RootDir, 'public');


/**
 * Defines all file paths with file names as keys
 */
const FilePaths = {
    login: Path.getFile(RootDir, 'public', 'views', 'pages', 'guest', 'login.html'),
    home: Path.getFile(RootDir, 'public', 'views', 'pages', 'guest', 'home.html'),
    register: Path.getFile(RootDir, 'public', 'views', 'pages', 'guest', 'register.html'),
}



/*
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
MIME TYPE CONSTANTS
`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
*/

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


const ValidationRules = {
    'system-admin-login': {
        email: {
            required: true,
            exists: 'system-admins'
        }
    }
}


module.exports = { MinRandom, MaxRandom, FilePaths, MimeTypes, StaticFilePath, RootDir };


/**
 * Workflow
 * -> Create super admins section
 * -> Allow super Admins to register system admins
 * -> Allow system admins to login to the system
 */
