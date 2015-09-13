gulp = require 'gulp'
watch = require 'gulp-watch'
run = require 'gulp-run'
browserSync = require('browser-sync').create()

filename = 'metaflux.md'

gulp.task 'slideshow', ->
	run("slideshow build #{filename} -t impress.js")
		.exec()
		.pipe(gulp.dest('output'))

gulp.task 'serve', ->
	browserSync.init
		server:
			baseDir: "."

	watch filename, ->
		gulp.start('slideshow')

	watch 'metaflux.html', ->
		browserSync.reload()

gulp.task 'default', ['serve']
