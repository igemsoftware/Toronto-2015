// ==== node_modules ====
var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var sass = require('gulp-sass');

// ==== src and dest for index.html ====
var index = './src/index.html';
var indexDest = './src';
// ==== scss and css dirs ====
var sassDir = './src/styles/sass/*.scss';
var cssDir = './src/styles';

/**
 * ==== wiredep ====
 *
 * Takes css and js from bower_components and inserts into index.html
 */
gulp.task('wiredep', function() {
    gulp.src(index).pipe(wiredep()).pipe(gulp.dest(indexDest));
});


/**
 * ==== inject-css ====
 *
 * Inserts link tag for any css files in ./src/styles into index.html
 */
gulp.task('inject-css', function() {
    var sources = gulp.src('./src/styles/*.css', {read: false});
    gulp.src(index).pipe(inject(sources, {relative: true})).pipe(gulp.dest(indexDest));
});


/**
 * ==== sass ====
 *
 * Compile styles.scss into style.css with node-sass (libsass).
 */
gulp.task('sass', function() {
    gulp.src(sassDir).pipe(sass().on('error', sass.logError)).pipe(gulp.dest(cssDir));
});

/**
* ==== watch:sass ====
*
* Calls sass task on filechange in sassDir.
*/
gulp.task('watch:sass', function() {
   gulp.watch(sassDir, ['sass']);    
});


/**
* ==== inject ====
*
* The main inject task.
* Doesn't work from blank file?
*/
gulp.task('inject', ['wiredep', 'inject-css']);
