var JSDUCK_DIR_NAME = 'jsduck';
var CONFIG_FILE_NAME = 'config.json';
var WELCOME_TEMPLATE_FILE_NAME = 'welcome.tpl';

var path = require('path');
var fs = require('fs');
var winston = require('winston');

exports.getConfig = function (repo, callback) {
    var filename = path.join(repo, JSDUCK_DIR_NAME, CONFIG_FILE_NAME);
    fs.readFile(
        filename,
        { encoding: 'utf8' },
        function (err, data) {
            if (err) {
                winston.error('Failed to read "' + CONFIG_FILE_NAME + '": ' + err);
                return callback(err);
            }

            try {
                var config = JSON.parse(data);
                callback(null, config);
            }
            catch (error) {
                callback(error);
            }
        }
    );
};

exports.updateConfig = function (repo, output, commitInfo, callback) {
    // 修改配置文件
    var modifyConfigFile = function (done) {
        exports.getConfig(
            repo,
            function (err, config) {
                if (err) {
                    return done(err);
                }

                config['--welcome'] = 'welcome.html';
                config['--output'] = output;
                winston.info('Write modified "config.json" for jsduck');
                var filename = path.join(repo, JSDUCK_DIR_NAME, CONFIG_FILE_NAME);
                fs.writeFile(filename, JSON.stringify(config), done);
            }
        );
    };
    // 获取欢迎页HTML
    var generateWelcomeHTML = function (done) {
        exports.getWelcomeHTML(
            repo,
            commitInfo,
            function (err, html) {
                if (err) {
                    return done(err);
                }

                var filename = path.join(repo, JSDUCK_DIR_NAME, 'welcome.html');
                fs.writeFile(filename, html, done);
            }
        );
    };
    require('async').parallel([modifyConfigFile, generateWelcomeHTML], callback);
};

exports.getWelcomeHTML = function (repo, commitInfo, callback) {
    fs.readFile(
        WELCOME_TEMPLATE_FILE_NAME,
        { encoding: 'utf8' },
        function (err, data) {
            if (err) {
                return callback(err);
            }

            var lastCommit = commitInfo.commits[commitInfo.commits.length - 1];
            var templateData = {
                owner: commitInfo.repository.owner.name,
                name: commitInfo.repository.name,
                updateTime: require('moment')(lastCommit.timestamp).format('YYYY-MM-DD HH:mm:ss'),
                repoURL: commitInfo.repository.url,
                branch: commitInfo.ref.split('/').pop(),
                commitMessage: lastCommit.message,
                sha: lastCommit.url.split('/').pop(),
                url: lastCommit.url,
                author: lastCommit.author.name,
                authorEmail: lastCommit.author.email
            };
            var html = require('mustache').render(data, templateData);

            callback(null, html);
        }
    );
};


exports.generate = function (repo, commitInfo, callback) {
    winston.info('Start generate documents with jsduck');
    var output = require('temp').path();
    exports.updateConfig(
        repo,
        output,
        commitInfo,
        function (err, config) {
            if (err) {
                return callback(err);
            }

            winston.info('Run jsduck command at "' + repo + '"');
            var jsduck = require('child_process').spawn(
                'jsduck',
                ['--config=jsduck/config.json'],
                {
                    cwd: repo
                }
            );
            jsduck.on(
                'close',
                function (code) {
                    callback(null, output);
                }
            );
        }
    );
};
