// ==== node_modules ====
var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// ==== src and dest for index.html ====
var index = './src/index.html';
var indexDest = './src';
// ==== scss and css dirs ====
var sassDir = './src/styles/sass/*.scss';
var cssDir = './src/styles';

// runs on bower postinstall hook
gulp.task('wiredep', function() {
    gulp.src(index).pipe(wiredep()).pipe(gulp.dest(indexDest));
});

gulp.task('inject-css', function() {
    var sources = gulp.src('./src/styles/*.css', {read: false});
    gulp.src(index).pipe(inject(sources, {relative: true})).pipe(gulp.dest(indexDest));
});

gulp.task('inject-js', function() {
    var sources = gulp.src('./src/app/**/*.js', {read: false});
    gulp.src(index).pipe(inject(sources, {relative: true})).pipe(gulp.dest(indexDest))
});

gulp.task('sass', function() {
    gulp.src(sassDir)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDir))
    .pipe(browserSync.stream());
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
    gulp.watch('./src/app/**/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'serve']);

gulp.task('inject', ['wiredep', 'inject-css']);
