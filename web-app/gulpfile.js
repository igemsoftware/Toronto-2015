// # gulpfile.js

// ### Development Dependencies

// Installed with `npm install --save-dev <dep>`
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    concat      = require('gulp-concat'),
    wiredep     = require('wiredep').stream,
    angularFilesort = require('gulp-angular-filesort'),
    inject      = require('gulp-inject'),
    globby      = require('globby'),
    combiner   = require('stream-combiner2'),
    sass        = require('gulp-sass'),
    plumber     = require('gulp-plumber'),
    browserify  = require('browserify'),
    coffeeify   = require('coffeeify'),
    browserSync = require('browser-sync').create(),
    buffer      = require('vinyl-buffer'),
    source      = require('vinyl-source-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    docco       = require('gulp-docco'),
    gutil       = require('gulp-util'),
    del         = require('del');

// For a little convenience
var reload = browserSync.reload;

// ### Options

// Source directory
var src = './src';
// Globs used in `gulp.src(<glob>)`
var globs = {
    index   : src + '/index.html',
    html    : src + '/**/*.html',
    coffee  : src + '/coffee/**/*.coffee',
    libJS   : src + '/lib/**/*.js',
    sass    : src + '/styles/sass/*.scss',
    css     : src + '/styles/*.css'
};
// Destinations used in `gulp.dest(<dir>)`
var dests = {
    index : src,
    js    : src + '/lib',
    css   : src + '/styles',
    docs  : './docs'
};

// ### Sass

// Compile `.scss` into `.css`
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

// Compile `.coffee` into `.js`
gulp.task('coffee', function() {

    globby([globs.coffee], function(err, entries) {
        if (err) {
            gutil.log();
            return;
        }

        var b = browserify({
            entries    : entries,
            extensions : ['.coffee'],
            debug      : true,
            transform  : [coffeeify]
        });

        var combined = combiner.obj([
            b.bundle(),
            source('bundle-coffee.js'),
            buffer(),
            sourcemaps.init({loadMaps: true}),
            sourcemaps.write('./maps'),
            gulp.dest(dests.js)
        ]);

        combined.on('error', gutil.log);

        return combined;
    });
});

// ### Injects

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
    return gulp.src(globs.index)
        .pipe(inject(gulp.src(['./src/app/**/*.js', './src/lib/**/*.js']).pipe(angularFilesort()),{relative: true}))
        .pipe(gulp.dest(dests.index));
});

// Wiredep
gulp.task('wiredep', function() {
    return gulp
    .src(globs.index)
    .pipe(wiredep())
    .pipe(gulp.dest(dests.index));
});

// Bringing it together
gulp.task('inject', ['inject:css', 'inject:js', 'wiredep']);


// ### Docco

// gulpfile documentation
gulp.task('docs:gulpfile', function() {
    return gulp
    .src('./gulpfile.js')
    .pipe(docco())
    .pipe(gulp.dest(dests.docs));
});

// CoffeeScript documentation
gulp.task('docs:coffee', function() {
    return gulp
    .src(globs.coffee)
    .pipe(docco())
    .pipe(gulp.dest(dests.docs));
});

// all documentation
gulp.task('docs', ['docs:gulpfile', 'docs:coffee'], function() {
    reload();
});


// ### Clean

// Remove css files
gulp.task('clean:css', function(cb) {
    del([globs.css], cb);
});

gulp.task('clean:lib', function(cb) {
    del([dests.js], cb);
});

gulp.task('clean', ['clean:css']);


// ### Serve

// Run `sass` and `coffee`before `serve`ing
gulp.task('serve', ['sass', 'coffee'], function() {
    browserSync.init({
        server: {
            baseDir : src,
            routes  : {
                '/bower_components' : './bower_components',
                '/node_modules' :'./node_modules'
            }
        }
    });

    // Recompile `sass` as necessary
    watch(globs.sass, function() { gulp.start('sass'); });
    // Recompile `CoffeeScript` as necessary
    watch(globs.coffee, function() { gulp.start('coffee'); });
    // Refresh on `libJS` changes i.e. `coffee` finished
    watch(globs.libJS, function() { reload(); });
    // Refresh on any `HTML` changes
    watch(globs.html, function() { reload(); });
});

// Serve docs folder
gulp.task('serve:docs', ['docs'], function() {
    browserSync.init({
        server: {
            baseDir : dests.docs
        }
    });

    watch(globs.coffee, function() { gulp.start('docs'); });
});

// ### Default

// By default, `serve`
gulp.task('default', ['serve']);
