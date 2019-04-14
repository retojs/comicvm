const path = require('path');
const fs = require('fs');

module.exports.setupEndpoints = function (app, rootDir) {

    const imagesDir = 'images';
    const plotDir = 'plot';

    /**
     * @param: story: the name of the story you want to get the names of all scenes for
     */
    app.get('/:story/scenes', function (req, res) {
        const story = req.params['story'];
        const plotPath = `/${story}/${plotDir}`;

        getUrls(rootDir + plotPath, '', null, function (paths) {
            res.send(paths.map(p => {
                // chop leading slash and file ending
                return p.substr(1, p.indexOf('.plot.txt') - 1);
            }));
        });
    });

    /**
     * @param: story: the name of the story you want to get the list of all image urls for
     */
    app.get('/:story/images', function (req, res) {
        const story = req.params['story'];
        const imagePath = `/${story}/${imagesDir}`;

        getUrls(rootDir + imagePath, imagePath, ['background', 'character'], function (paths) {
            res.send(paths);
        });
    });


    /**
     * Maps the files in the specified directory to urls with the specified prefix
     *
     * @param directory: the absolute path to the directory to scan
     * @param baseUrl: the base URL to append file paths to
     * @param cb: callback
     */
    function getUrls(directory, baseUrl, subdirs, cb) {
        return listFileUrls(directory, '', baseUrl, subdirs, [], cb);
    }

    /**
     * Maps the files in the directory specified by basePath + subPath to urls with the specified prefix.
     * The subPath is included in the returned URL, too.
     * Sub-directories are traversed recursively (only the specified sub-directories if any specified).
     * Files and directories starting with underscore or dot are ignored.
     * Files named 'Thumbs.db' are ignored, too.
     *
     * @param basePath: not included in the returned URL
     * @param subPath: included in the returned URL
     * @param urlPrefix: prefix of the returned URL
     * @param result: the list of URLs
     * @param cb: callback function
     */
    function listFileUrls(basePath, subPath, urlPrefix, subdirs, result, cb) {
        const filePath = basePath + subPath;

        if (false) {
            console.log('collecting list elements in folder ', filePath);
            console.log(' - subPath:', subPath);
            console.log(' - urlPrefix:', urlPrefix);
            console.log(' - result:', result);
            console.log(' - subdirs:', subdirs);
        }

        fs.readdir(filePath, function (err, files) {
            if (err) {
                throw err;
            }

            let pending = files.length;
            if (!pending) return cb([]);

            files.forEach(function (file) {
                if (file.indexOf('_') === 0 || file.indexOf('.') === 0) { // ignore files starting with underscore or dot
                    if (!--pending) cb(result);
                } else {
                    const absPath = path.resolve(filePath, file);
                    fs.stat(absPath, function (err, stat) {

                        if (stat && stat.isDirectory()) {
                            if (!subdirs || subdirs.indexOf(file) > -1) {
                                listFileUrls(basePath, `${subPath}/${file}`, urlPrefix, subdirs, result, function (result) {
                                    if (!--pending) cb(result);
                                });
                            } else {
                                if (!--pending) cb(result);
                            }

                        } else if (stat && stat.isFile()) {
                            if (file !== 'Thumbs.db'
                                && (file.indexOf(".png") > 0
                                    || file.indexOf(".jpg") > 0
                                    || file.indexOf(".txt") > 0)) {
                                result.push(`${urlPrefix}${subPath}/${file}`);
                            }
                            if (!--pending) cb(result);
                        }
                    });
                }
            });
        });
    }
};