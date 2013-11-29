var fs = require('fs-extra');
var winston = require('winston');

exports.update = function (commitInfo, sourceFolder, callback) {
    var name = commitInfo.repository.name;
    var branch = commitInfo.ref.split('/').pop() === 'master' ? 'stable' : 'dev';
    // TODO: 用环境变量
    var docFolder = require('path').join('/', 'var', 'www', 'doc', name, branch);
    if (!fs.existsSync(docFolder)) {
        winston.log('Document site folder "' + docFolder + '" does not exit, create it');
        try {
            fs.mkdirpSync(docFolder);
            winston.log('Create dir "' + docFolder + '"');
        }
        catch (err) {
            callback(err);
        }
    }

    winston.info('Remove old documents');
    fs.remove(
        docFolder,
        function (err) {
            if (err) {
                return callback(err);
            }

            winston.info('Move new documents to site folder "' + docFolder + '"');
            fs.rename(sourceFolder, docFolder, function (err) {
                if (err) {
                    console.error('Failed to move document to site folder: ' + err);
                    console.log('Remove generated documents due to failure');
                    return fs.remove(sourceFolder, callback);
                }

                callback(err);
            });
        }
    );
};
