'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var ftp = require( 'vinyl-ftp' );

gulp.task('serve',['deploy'], function() {
	browserSync.init({
		proxy: "http://67.23.236.49/~himalaya/pruebas/facebookbadge"
		//proxy: "127.0.0.1/himalaya/sps/"
	});
	gulp.watch('./src/scss/**/*.scss',['deploy']);
	gulp.watch(["./**/*.php"]).on('change', browserSync.reload);
});

gulp.task('sass', function () {
	return gulp.src('./src/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass( {outputStyle: 'compressed'} ).on('error', sass.logError))
		.pipe(rename(function (path) {
			path.basename += ".min";
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task( 'deploy', ['sass'], function () {
 
	var conn = ftp.create( {
		host:     '67.23.236.49',
		user:     'desarrollo@himalayainternetmarketing.com',
		password: '[W53rcXh2Uwm',
		parallel: 10
	} );
 
	var globs = [
		'assets/css/**',
	];
 
	// using base = '.' will transfer everything to /public_html correctly 
	// turn off buffering in gulp.src for best performance 
 
	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe( conn.newer( '/facebookbadge' ) ) // only upload newer files 
		.pipe( conn.dest( '/facebookbadge' ) );
 
} );


gulp.task('default',['serve']);