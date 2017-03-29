// Generated on 2017-03-29 using generator-angular-fullstack 3.7.4
'use strict';

const _ = require('lodash');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const gulpLoadPlugins = require('gulp-load-plugins');
const http = require('http');
const open = require('open');
const lazypipe = require('lazypipe');
const wiredep = require('wiredep').stream;
const nodemon = require('nodemon');
const runSequence = require('run-sequence');
const { Instrumenter } = require('isparta');

var plugins = gulpLoadPlugins();

const clientPath = require('./bower.json').appPath || 'client';
const serverPath = 'server';
const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        scripts: [
            `${clientPath}/**/!(*.spec|*.mock).js`,
            `!${clientPath}/bower_components/**/*`
        ],
        styles: [`${clientPath}/{app,components}/**/*.scss`],
        mainStyle: `${clientPath}/app/app.scss`,
        views: `${clientPath}/{app,components}/**/*.html`,
        mainView: `${clientPath}/index.html`,
        test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
        bower: `${clientPath}/bower_components/`
    },
    server: {
        scripts: [
          `${serverPath}/**/!(*.spec|*.integration).js`
        ],
        json: [`${serverPath}/**/*.json`],
        test: {
          integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
          unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
        }
    },
    dist: 'dist'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

function checkAppReady(cb) {
    var options = {
        host: 'localhost',
        port: process.env.PORT
    };
    http
        .get(options, () => cb(true))
        .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
    var serverReady = false;
    var appReadyInterval = setInterval(() =>
        checkAppReady((ready) => {
            if (!ready || serverReady) {
                return;
            }
            clearInterval(appReadyInterval);
            serverReady = true;
            cb();
        }),
        100);
}

function sortModulesFirst(a, b) {
    var module = /\.module\.js$/;
    var aMod = module.test(a.path);
    var bMod = module.test(b.path);
    // inject *.module.js first
    if (aMod === bMod) {
        // either both modules or both non-modules, so just sort normally
        if (a.path < b.path) {
            return -1;
        }
        if (a.path > b.path) {
            return 1;
        }
        return 0;
    } else {
        return (aMod ? -1 : 1);
    }
}

/********************
 * Reusable pipelines
 ********************/

let styles = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.sass)
    .pipe(plugins.autoprefixer, {browsers: ['last 1 version']})
    .pipe(plugins.sourcemaps.write, '.');


/********************
 * Tasks
 ********************/

gulp.task('inject', cb => {
    runSequence(['inject:js', 'inject:css', 'inject:scss'], cb);
});

gulp.task('inject:js', () => {
    return gulp.src(paths.client.mainView)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.scripts, [`!${clientPath}/**/*.{spec,mock}.js`, `!${clientPath}/app/app.js`]), {read: false})
                .pipe(plugins.sort(sortModulesFirst)),
            {
                starttag: '<!-- injector:js -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<script src="' + filepath.replace(`/${clientPath}/`, '') + '"></script>'
            }))
        .pipe(gulp.dest(clientPath));
});

gulp.task('inject:css', () => {
    return gulp.src(paths.client.mainView)
        .pipe(plugins.inject(
            gulp.src(`${clientPath}/{app,components}/**/*.css`, {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '<!-- injector:css -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace(`/${clientPath}/`, '').replace('/.tmp/', '') + '">'
            }))
        .pipe(gulp.dest(clientPath));
});

gulp.task('inject:scss', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
                .pipe(plugins.sort()),
            {
                transform: (filepath) => {
                    let newPath = filepath
                        .replace(`/${clientPath}/app/`, '')
                        .replace(`/${clientPath}/components/`, '../components/')
                        .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
                        .replace('.scss', '');
                    return `@import '${newPath}';`;
                }
            }))
        .pipe(gulp.dest(`${clientPath}/app`));
});

gulp.task('styles', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('jscs', () => {
  return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
      .pipe(plugins.jscs())
      .pipe(plugins.jscs.reporter());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));

gulp.task('start:client', cb => {
    whenServerReady(() => {
        open('http://localhost:' + process.env.PORT);
        cb();
    });
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:inspector', () => {
    gulp.src([])
        .pipe(plugins.nodeInspector());
});

gulp.task('start:server:debug', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    nodemon(`-w ${serverPath} --debug-brk ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    var testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

    plugins.livereload.listen();

    plugins.watch(paths.client.styles, () => {  //['inject:scss']
        gulp.src(paths.client.mainStyle)
            .pipe(plugins.plumber())
            .pipe(styles())
            .pipe(gulp.dest('.tmp/app'))
            .pipe(plugins.livereload());
    });

    plugins.watch(paths.client.views)
        .pipe(plugins.plumber())
        .pipe(plugins.livereload());

    plugins.watch(paths.client.scripts) //['inject:js']
        .pipe(plugins.plumber())
        .pipe(gulp.dest('.tmp'))
        .pipe(plugins.livereload());

    plugins.watch(_.union(paths.server.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(plugins.livereload());

    gulp.watch('bower.json', ['wiredep:client']);
});

gulp.task('serve', cb => {
    runSequence(['clean:tmp'],
        ['inject'],
        ['wiredep:client'],
        ['styles'],
        ['start:server', 'start:client'],
        'watch',
        cb);
});

gulp.task('serve:dist', cb => {
    runSequence(
        'build',
        ['start:server:prod', 'start:client'],
        cb);
});

gulp.task('serve:debug', cb => {
    runSequence(['clean:tmp'],
        ['inject'],
        ['wiredep:client'],
        ['styles'],
        'start:inspector',
        ['start:server:debug', 'start:client'],
        'watch',
        cb);
});

// inject bower components
gulp.task('wiredep:client', () => {
    return gulp.src(paths.client.mainView)
        .pipe(wiredep({
            exclude: [
                /bootstrap.js/,
                '/json3/',
                '/es5-shim/',
                /font-awesome\.css/,
                /bootstrap\.css/,
                /bootstrap-sass-official/
            ],
            ignorePath: clientPath
        }))
        .pipe(gulp.dest(`${clientPath}/`));
});

gulp.task('wiredep:test', () => {
    return gulp.src(paths.karma)
        .pipe(wiredep({
            exclude: [
                /bootstrap.js/,
                '/json3/',
                '/es5-shim/',
                /font-awesome\.css/,
                /bootstrap\.css/,
                /bootstrap-sass-official/
            ],
            devDependencies: true
        }))
        .pipe(gulp.dest('./'));
});

/********************
 * Build
 ********************/

//FIXME: looks like font-awesome isn't getting loaded
gulp.task('build', cb => {
    runSequence(
        [
            'clean:dist',
            'clean:tmp'
        ],
        'inject',
        'wiredep:client',
        [
            'build:images',
            'copy:extras',
            'copy:fonts',
            'copy:assets',
            'copy:server',
            'build:client'
        ],
        cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));

gulp.task('build:client', ['styles', 'html', 'build:images'], () => {
    var manifest = gulp.src(`${paths.dist}/${clientPath}/assets/rev-manifest.json`);

    var appFilter = plugins.filter('**/app.js', {restore: true});
    var jsFilter = plugins.filter('**/*.js', {restore: true});
    var cssFilter = plugins.filter('**/*.css', {restore: true});
    var htmlBlock = plugins.filter(['**/*.!(html)'], {restore: true});

    return gulp.src(paths.client.mainView)
        .pipe(plugins.useref())
            .pipe(appFilter)
                .pipe(plugins.addSrc.append('.tmp/templates.js'))
                .pipe(plugins.concat('app/app.js'))
            .pipe(appFilter.restore)
            .pipe(jsFilter)
                .pipe(plugins.ngAnnotate())
                .pipe(plugins.uglify())
            .pipe(jsFilter.restore)
            .pipe(cssFilter)
                .pipe(plugins.cleanCss({
                    processImportFrom: ['!fonts.googleapis.com']
                }))
            .pipe(cssFilter.restore)
            .pipe(htmlBlock)
                .pipe(plugins.rev())
            .pipe(htmlBlock.restore)
        .pipe(plugins.revReplace({manifest}))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('html', function() {
    return gulp.src(`${clientPath}/{app,components}/**/*.html`)
        .pipe(plugins.angularTemplatecache({
            module: 'tessssApp'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('build:images', () => {
    return gulp.src(paths.client.images)
        .pipe(plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        .pipe(plugins.rev.manifest(`${paths.dist}/${clientPath}/assets/rev-manifest.json`, {
            base: `${paths.dist}/${clientPath}/assets`,
            merge: true
        }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:extras', () => {
    return gulp.src([
        `${clientPath}/favicon.ico`,
        `${clientPath}/robots.txt`,
        `${clientPath}/.htaccess`
    ], { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('copy:fonts', () => {
    return gulp.src(`${clientPath}/bower_components/{bootstrap,font-awesome}/fonts/**/*`, { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/bower_components`));
});

gulp.task('copy:assets', () => {
    return gulp.src([paths.client.assets, '!' + paths.client.images])
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:server', () => {
    return gulp.src([
        'package.json',
        'bower.json',
        '.bowerrc'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});
