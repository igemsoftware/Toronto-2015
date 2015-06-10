// ==== node_modules ====
var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');

// ==== src and dest for index.html ====
var index = './src/index.html';
var indexDest = './src';


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
* ==== inject ====
*
* The main inject task.
* Doesn't work from blank file?
*/
gulp.task('inject', ['wiredep', 'inject-css']);
