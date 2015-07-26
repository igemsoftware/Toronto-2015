// # gulpfile

// Development Dependencies
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    wiredep     = require('wiredep').stream,
    inject      = require('gulp-inject'),
    sass        = require('gulp-sass'),
    coffee      = require('gulp-coffee'),
    browserSync = require('browser-sync').create(),
    sourcemaps  = require('gulp-sourcemaps'),
    docco       = require('gulp-docco'),
    gutil       = require('gulp-util'),
    del         = require('del');

// Globs and Dests
var src = './src';
var globs = {
    index   : src + '/index.html',
    html    : src + '/**/*.html',
    coffee  : src + '/coffee/*.coffee',
    libJS   : src + '/lib/**/*.js',
    sass    : src + '/styles/sass/*.scss',
    css     : src + '/styles/*.css'
};
var dests = {
    index : src,
    js    : src + '/lib',
    css   : src + '/styles',
    docs  : './docs'
};

// ### Sass

// Compile scss into css
gulp.task('sass', function() {
    return gulp
    .src(globs.sass)
    .pipe(sass({   
        includePaths: ['./bower_components/compass-mixins/lib'] 
    }).on('error', sass.logError))
    .pipe(gulp.dest(dests.css))
    .pipe(browserSync.stream());
});


// ### CoffeeScript

// Compile .coffee into .js
gulp.task('coffee', function() {
    return gulp
    .src(globs.coffee)
    .pipe(sourcemaps.init())
    .pipe(coffee({
        bare: true
    }).on('error', gutil.log))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dests.js));
});

// Inject CSS
gulp.task('inject:css', function() {
    var sources = gulp.src(globs.css, {read: false});    

    return gulp
    .src(globs.index)
    .pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest(dests.index));
});

// Inject JS
gulp.task('inject:js', function() {
    var sources = gulp.src(globs.libJS, {read: false}); 

    return gulp
    .src(globs.index) 
    .pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest(dests.index));
});

// Wiredep
gulp.task('wiredep', function() {
    return gulp
    .src(globs.index)
    .pipe(wiredep())
    .pipe(gulp.dest(dests.index));
});

// ### Inject

gulp.task('inject', ['wiredep', 'inject:css', 'inject:js']);


// ### Docco

// gulpfile documentation
gulp.task('docs:gulpfile', function() {
    return gulp
    .src('./gulpfile.js')
    .pipe(docco())
    .pipe(gulp.dest(dests.docs));
})

// all documentation
gulp.task('docs', ['docs:gulpfile']);


// ### Clean

// Remove css files
gulp.task('clean:css', function(cb) {
    del([globs.css], cb);
});

gulp.task('clean', ['clean:css']);

// ### Serve

gulp.task('serve', ['sass', 'coffee'], function() {
    var reload = browserSync.reload;

    browserSync.init({
        server: {
            baseDir : src,
            routes  : {
                '/bower_components' : './bower_components'    
            }
        }
    });

    // Recompile sass as necessary
    // gulp.watch(globs.sass, ['sass']);
    watch(globs.sass, function() {
        gulp.start('sass');
    })
    // Recompile CoffeeScript as necessary
    gulp.watch(globs.coffee, ['coffee']);
    // Refresh on libJS changes i.e. coffee finished
    gulp.watch(globs.libJS).on('change', reload);
    // Refresh on any HTML changes
    gulp.watch(globs.html).on('change', reload);
});

// ### Default
gulp.task('default', ['serve']);
