// Miroslav Georgiev
'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');

// css tasks
gulp.task('css', function () {
    var stream = gulp
            .src('public_html/dev/css/app.less')
            .pipe(less())
            .pipe(gulp.dest('public_html/public/assets/css'))
            .pipe(sourcemaps.init())
            .pipe(minifyCSS())
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public_html/public/assets/css'));
    return stream;
});

// js tasks
gulp.task('js', function () {
    var stream = gulp
            .src(['publich_html/*.js', 'public_html/public/app/*.js', 'public_html/app/**/*.js', 'public_html/dev/js/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    return stream;
});

gulp.task('scripts', function () {
    var stream = gulp
            .src(['public_html/dev/js/*.js'])
            .pipe(sourcemaps.init())
            .pipe(concat('all.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public_html/public/assets/js'));
    return stream;
});

gulp.task('angular', function () {
    var stream = gulp
            .src(['public_html/public/app/*.js', 'public_html/public/app/**/*.js'])
            .pipe(sourcemaps.init())
            .pipe(ngAnnotate())
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public_html/public/assets/js'));
    return stream;
});

// test runner
gulp.task('unittest', function () {
    return gulp.src('test/unit/*.js')
        .pipe(jasmine());
});

// auto run
gulp.task('watch', function () {
    // watch the css files
    gulp.watch('public_html/dev/css/*.less', ['css']);

    // watch the js files
    gulp.watch(['public_html/dev/js/*.js', 'public_html/public/app/*.js', 'public_html/public/app/**/*.js'], ['scripts', 'angular']);
//    gulp.watch(['public_html/dev/js/*.js', 'public_html/public/app/*.js', 'public_html/public/app/**/*.js'], ['scripts', 'angular', 'unittest']);
});

// server task
gulp.task('nodemon', function () {
    nodemon({
        script: 'public_html/server.js',
        ext: 'js less html'
    })
            .on('start', ['watch'])
            .on('change', ['watch'])
            .on('restart', function () {
                console.log('Restarted!');
            });
});

// define the default gulp task
gulp.task('default', ['watch']);