const multer = require('multer');
const path = require('path');

module.exports.setupEndpoints = function (app, rootDir) {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const path = decodeURIComponent(req.params['path']);
            cb(null, `${rootDir}/${req.params['story']}/images/${path}`);
        },
        filename: function (req, file, cb) {
            console.log(`upload ${req.params['path']} image '${file.originalname}'`);
            cb(null, file.originalname)
        }
    });

    const upload = multer({storage: storage});


    /**
     * @param story: the story the uploaded image belongs to
     * @param path: the path to upload the image to (?)
     * @param FormData with 'image' property
     */
    app.post('/:story/upload-image/:path', upload.single('image'), function (req, res) {
        res.end();
    });

    /**
     * @param story:
     * @param path:
     */
    app.post('/:story/images/move/tmp/:path', function (req, res) {
        const story = req.params['story'];
        const path = req.params['path'];
        const dest = req.body['dest'];
        const localPath = {
            from: toLocalPath(`/${story}/images/tmp/${path}`),
            to: toLocalPath(dest)
        };

        fs.rename(localPath.from, localPath.to, function () {
            console.log(`moved image\n from ${localPath.from}\n to ${localPath.to}`);
            res.end();
        });
    });


    /**
     * the stories are not inside the app directory
     *  -> return the requested file from a different local directory
     */
    app.get('/:story/*', function (req, res) {
        const localPath = toLocalPath(req.path);
        res.sendFile(localPath);
    });

    app.post(':story/*', function (req, res) {
        const localPath = toLocalPath(req.path);
        fs.writeFile(localPath, req.body.content, function () {
            console.log(req.path + ' saved');
            res.end();
        });
    });

    /**
     * Converts a path from a URL to a local path
     *
     * @param urlPath: the path from the requested URL
     * @returns {string}
     */
    function toLocalPath(urlPath) {
        urlPath = decodeURIComponent(urlPath);
        if (true) {
            console.log('function toLocalPath:');
            console.log(' - urlPath: ', urlPath);
            console.log(' - local path: ', path.join(rootDir, urlPath));
        }
        return path.join(rootDir, urlPath);
    }
};