var PORT = 8610;

var fs = require('fs-extra');
var GitHubAPI = require('github');
var winston = require('winston');

function generateDocumentAtLocal(taskFolder, commitInfo, callback) {
    var repoFolder = require('path').join(
        taskFolder, 
        fs.readdirSync(taskFolder)[0]
    );
    require('./jsduck').generate(
        repoFolder,
        commitInfo,
        function (err, output) {
            if (err) {
                return callback(err);
            }

            winston.info('Document located at "' + output + '"');
            require('./doc').update(commitInfo, output, callback);
        }
    );
}

function generateDocument(repository, commitInfo, callback) {
    winston.info('Request archive link for ' + repository);

    var github = new GitHubAPI({ version: '3.0.0' });
    github.repos.getArchiveLink(
        {
            user: commitInfo.repository.owner.name,
            repo: commitInfo.repository.name,
            archive_format: 'zipball',
            ref: commitInfo.ref.split('/').pop()
        },
        function (err, data) {
            if (err) {
                return callback(err);
            }

            var url = require('url').parse(data.meta.location);
            winston.info('Download zip file at "' + url.href + '"');
            var request = require('https').get(
                {
                    hostname: url.hostname,
                    path: url.path,
                    headers: {
                        'Accept': '*/*',
                        'User-Agent': 'Document Generator'
                    }
                },
                function (response) {
                    winston.info('Received zip file from github with status code ' + response.statusCode);

                    var taskFolder = require('temp').path();

                    winston.info('Allocate "' + taskFolder + '" for this task');

                    var unzip = require('unzip').Extract({ path: taskFolder });
                    response.pipe(unzip);

                    unzip.on(
                        'close',
                        function () {
                            generateDocumentAtLocal(
                                taskFolder,
                                commitInfo,
                                function (err) {
                                    if (err) {
                                        winston.error('Failed to generate local document: ' + err);
                                    }
                                    winston.log('Remove temp task folder');

                                    fs.remove(
                                        taskFolder,
                                        function (e) { callback(err | e); }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}

function processGitHubCommit(request, response) {
    var commitInfo = request.body.payload;

    if (!commitInfo) {
        response.writeHead(403);
        response.end('No commit payload');
        return;
    }

    response.writeHead(204);
    response.end();

    commitInfo = JSON.parse(commitInfo);
    
    // 只处理head上的更新
    if (commitInfo.ref.indexOf('heads') < 0) {
        return;
    }

    var repository = commitInfo.repository.name + '@' + commitInfo.ref.split('/').pop();
    winston.info('Received commit for ' + repository);

    generateDocument(
        repository,
        commitInfo,
        function (err) {
            if (err) {
                winston.error('Failed to complete this task: ' + err);
                return;
            }

            winston.info('Task complete for ' + repository);
        }
    );
}

function greet(request, response, next) {
    if (require('url').parse(request.url).pathname === '/hello') {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('OK');
    }
    else {
        next();
    }
}

var connect = require('connect');
var app = connect()
    .use(connect.bodyParser())
    .use(greet)
    .use(processGitHubCommit)
    .listen(PORT);

winston.info('Server started on ' + PORT);

process.on(
    'uncaughtException',
    function (err) {
        winston.error('Uncaught exception: ' + err);
    }
);