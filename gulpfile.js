// Miroslav Georgiev
'use strict';

const pkg = require('./package.json');
const gulp = require('gulp');
const gutil = require('gulp-util');
const less = require('gulp-less');
const minifyCSS = require('gulp-cssnano');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const del = require('del');
const shell = require('gulp-shell');
const swaggerJSDoc = require('swagger-jsdoc');
const gulpNSP = require('gulp-nsp');

function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true });

    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }));

        this.push(null);
    };

    return src;
}

// css tasks
gulp.task('css', () => {
    const stream = gulp
            .src('dev/css/all.less')
            .pipe(less())
            .pipe(gulp.dest('public/css'))
            .pipe(sourcemaps.init())
            .pipe(minifyCSS())
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/css'));

    return stream;
});

gulp.task('fonts', () => {
    const stream = gulp
        .src(['dev/fonts/*', 'public/libs/bootstrap/fonts/*', 'public/libs/font-awesome/fonts/*'])
        .pipe(gulp.dest('public/fonts'));

    return stream;
});

// js tasks
gulp.task('scripts', () => {
    const stream = gulp
            .src(['dev/js/*.js', 'dev/js/**/*.js'])
            .pipe(sourcemaps.init())
            .pipe(concat('all.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js'));

    return stream;
});

gulp.task('angular', () => {
    const stream = gulp
            .src([
                'public/app/*.js',
                '!public/app/*.spec.js',
                'public/app/**/*.module.js',
                'public/app/**/*.js',
                '!public/app/**/*.spec.js',
                'public/app/**/**/*.module.js',
                'public/app/**/**/*.js',
                '!public/app/**/**/*.spec.js'
            ])
            .pipe(sourcemaps.init())
            .pipe(ngAnnotate())
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js'));

    return stream;
});

// image task
gulp.task('images', () => {
    const stream = gulp.src(['dev/images/*', 'dev/images/**/*', '!dev/images/icons/apple-touch-icon*'], { base: 'dev/images/' })
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/images/'));

    return stream;
});

gulp.task('apple', () => {
    const stream = gulp.src(['dev/images/icons/apple-touch-icon-*'])
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/'));

    return stream;
});

// documentation tasks
// generate the schema in JSON format for Swagger
gulp.task('apischema', ['clean:apidocs'], () => {
    const swaggerDefinition = {
        swagger: "2.0",
        info: {
            title: 'App Name', // Title (required)
            version: pkg.version // Version (required)
        },
        schemes: ["https"],
        basePath: "/api"
    };
    const swoptions = {
        swaggerDefinition: swaggerDefinition,
        apis: ['./server/routes/**/*.js'] // Path to the API docs
    };

    // Initialize swagger-jsdoc -> returns validated swagger spec in json format
    const swaggerSpec = swaggerJSDoc(swoptions);

    return string_src("swagger.json", JSON.stringify(swaggerSpec, null, 2))
        .pipe(gulp.dest('dev/api/schema'));
});

gulp.task('apidocs', ['apischema'], () => {
    const stream = gulp
        .src(['dev/api/*', 'dev/api/**/*'], { base: 'dev/api/' })
        .pipe(gulp.dest('public/documentation/api'));

    return stream;
});

gulp.task('angulardocs', ['clean:angulardocs'], shell.task([
    'node_modules/jsdoc/jsdoc.js '+
    '-c ./conf.json '+ // config file
    '-t dev/angulardocs-template ' + // template file
    './README.md ' + // to include README.md as index contents
    '-r public/app' // source code directory
]));

// scan for vulnerabilities
gulp.task('nsp', cb => {
    gulpNSP({
        package: __dirname + '/package.json',
        stopOnError: false
    }, cb);
});

// clean task
gulp.task('clean', () => del(['public/css', 'public/js', 'public/fonts', 'public/images', 'public/documentation']));
gulp.task('clean:images', () => del(['public/images']));
gulp.task('clean:docs', () => del(['public/documentation']));
gulp.task('clean:angulardocs', () => del(['public/documentation/app']));
gulp.task('clean:apidocs', () => del(['dev/api/schema', 'public/documentation/api']));

// auto run
gulp.task('watch', () => {
    // watch the css files
    gulp.watch(['dev/css/*.less', 'dev/css/**/*.less'], ['css']);

    // watch the js files
    gulp.watch(['dev/js/*.js', 'dev/js/**/*.js'], ['scripts']);

    // watch angular files
    gulp.watch(['public/app/!(*.spec).js', 'public/app/**/!(*.spec).js', 'public/app/**/**/!(*.spec).js', 'README.md'], ['angular', 'angulardocs']);

    // watch image files
    gulp.watch(['dev/images/*'], ['images', 'apple']);

    // watch the api route files
    gulp.watch(['server/routes/**/*.js', 'dev/api/!(*.json)', 'dev/api/**/!(*.json)'], ['apidocs']);

    // watch the package.json file for changes and scan for vulnerabilities
    gulp.watch(['package.json'], ['nsp']);
});

// build all at once
gulp.task('build', ['clean'], () => gulp.start('css', 'fonts', 'scripts', 'angular', 'images', 'apple', 'angulardocs', 'apidocs', 'nsp'));

// generate documentation only
gulp.task('docs', ['clean:docs'], () => gulp.start('angulardocs', 'apidocs'));

// define the default gulp task
gulp.task('default', ['watch']);