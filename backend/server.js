'use strict';

const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || '3000';

const DEBUG = true;

// TODO make root dir configurable via command line option

/**
 * rootDir is the directory where all story files are written to.
 *
 * the folder structure is as follows:
 *
 *  root/
 *   - user-1/
 *      - story-1/
 *         - plot/
 *            - scene-1.plot.txt
 *            - scene-2.plot.txt
 *            - ...
 *         - layout/
 *            - scene-1.layout.yaml
 *            - scene-2.layout.yaml
 *            - ...
 *         - images/
 *            - background/
 *               - background-image-1-with-qualifiers.png
 *               - background-image-2-with-qualifiers.png
 *               - ...
 *            - character/
 *               - character-image-1-with-qualifiers.png
 *               - character-image-2-with-qualifiers.png
 *               - ...
 *
 */
const rootDir = path.join(__dirname, '/stories');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get(/^\//, function (req, res, next) {

    if (DEBUG) {
        console.log(`\n${req.method} request: ${req.originalUrl}`);
        console.log(' - path:', req.path);
        console.log(' - params:', req.params);
        console.log(' - query:', req.query);
        console.log(' - hostname:', req.hostname);
        console.log(' - baseUrl:', req.baseUrl);
    }
    next();
});

app.post(/^\//, function (req, res, next) {

    if (DEBUG) {
        console.log(`\n${req.method} request: ${req.originalUrl}`);
        console.log(' - path:', req.path);
        console.log(' - params:', req.params);
        console.log(' - query:', req.query);
        console.log(' - body:', req.body);
        console.log(' - hostname:', req.hostname);
        console.log(' - baseUrl:', req.baseUrl);
    }
    next();
});

require('./files').setupEndpoints(app, rootDir);
require('./storage').setupEndpoints(app, rootDir);

app.listen(port, () => {
    console.log(`ComicVM backend endpoints are available on port ${port}`);
    console.log(`Story file root directory is ${rootDir}`);
});
