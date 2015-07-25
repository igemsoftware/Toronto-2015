var gulp   = require('gulp'),
    inject = require('gulp-inject')
    sass   = require('gulp-sass');
    del    = require('del');

var src = './src';
var globs = {
    index   : src + '/index.html',
    html    : src + '/**/*.html',
    scripts : src + '/lib/**/*.js'
    sass    : src + '/styles/sass/*.scss',
    css     : src + '/styles/*.css'
};
var dests = {
    css : src + '/styles'
}

gulp.task('sass', function() {
    return gulp
    .src(globs.sass)
    .pipe(sass({
        includePaths: ['./bower_components/compass-mixins/lib']
    }).on('error', sass.logError))
    .pipe(gulp.dest(dests.css))
    .pipe(browserSync.stream());
});

gulp.task('sass:clean', function(cb) {
    del([paths.css], cb);
});


gulp.task('clean', ['sass:clean']);
