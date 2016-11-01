// Dependencies
var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var install = require('gulp-install');

// Clean build dir
gulp.task('clean', function(cb) {
	del('./build', cb);
});

// Move index.js over
gulp.task('js', function() {
	gulp.src('index.js')
		.pipe(gulp.dest('build/'))
});

// Install node modules
gulp.task('npm', function() {
	gulp.src('./package.json')
		.pipe(gulp.dest('./build/'))
		.pipe(install({production: true}));
});

// Create .zip
gulp.task('zip', function() {
	gulp.src(['build/**/*', '!build/package.json', 'build/.*'])
		.pipe(zip('output.zip'))
		.pipe(gulp.dest('./outputs'));
});

// Stage
gulp.task('stage', function(callback) {
	return runSequence(
		['clean'],
		['js'],
		['npm'],
		callback
	);
});
