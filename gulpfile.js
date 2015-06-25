// ==== node_modules ====
var gulp = require('gulp');
var watch = require('gulp-watch');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');
var compass = require('compass-importer');
var series = require('stream-series');

// ==== src and dest for index.html ====
var index = './src/index.html';
var indexDest = './src';
// ==== scss and css dirs ====
var sassDir = './src/styles/sass/*.scss';
var cssDir = './src/styles';
// === js files within ./src/app ====
var jsGlob = './src/app/**/*.js';
var jsAssetsGlob = './src/assets/js/**.js';

// runs on bower postinstall hook
gulp.task('wiredep', function() {
    gulp.src(index).pipe(wiredep()).pipe(gulp.dest(indexDest));
});

gulp.task('inject-css', function() {
    var sources = gulp.src('./src/styles/*.css', {read: false});
    gulp.src(index).pipe(inject(sources, {relative: true})).pipe(gulp.dest(indexDest));
});

gulp.task('inject-js', function() {
    var jsGlobSrc = gulp.src(jsGlob, {read: false});
    var jsAssetsGlobSrc = gulp.src(jsAssetsGlob, {read: false});

    gulp.src(index).pipe(inject(series(jsAssetsGlobSrc, jsGlobSrc), {relative: true})).pipe(gulp.dest(indexDest));

    //var sources = gulp.src(jsGlob, {read: false});
    //gulp.src(index).pipe(inject(sources, {relative: true})).pipe(gulp.dest(indexDest))
});

gulp.task('sass', function() {
    /*gulp.src(sassDir)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDir))
    .pipe(browserSync.stream());*/

    gulp.src(sassDir)
    .pipe(sass({
        includePaths: ['./bower_components/compass-mixins/lib']//,
        //importer: compass
    }).on('error', sass.logError))
    .pipe(gulp.dest(cssDir))
    .pipe(browserSync.stream());
});

gulp.task('jshint', function() {
    gulp.src(jsGlob)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './src',
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch(sassDir, ['sass']);
    gulp.watch('./src/**/*.html').on('change', browserSync.reload);
    gulp.watch(jsGlob).on('change', browserSync.reload);
    gulp.watch(jsGlob, ['jshint']);

    /*watch(jsGlob, function() {
        gulp.src(jsGlob).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
    });*/
});

gulp.task('default', ['sass', 'jshint', 'serve']);

gulp.task('inject', ['wiredep', 'inject-js', 'inject-css']);
