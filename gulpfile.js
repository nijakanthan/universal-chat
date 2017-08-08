var gulp = require('gulp');

var del = require('del');

// JS Gulp
var minify = require('gulp-minify');
var concat = require('gulp-concat');

// CSS Gulp
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');

var notify = require('gulp-notify');

gulp.task('default', function () {
    console.log('default');
});

gulp.task('clean', function () {
    return del(['dist']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

gulp.task('js', function () {
    var sources = gulp.src([
        'src/chat-module/module.js',
        'src/chat-module/constants.js',
        'src/chat-module/provider.js',
        'src/chat-module/factories.js',
        'src/chat-module/directives.js'
    ]);

    return sources.pipe(concat('uni-chat.js'))
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({
            message: 'JavaScript minification completed..'
        }));
});

gulp.task('css', function () {
    var sources = gulp.src([
        'src/chat-module/chat-app.css'
    ]);

    return sources.pipe(concatCss('uni-chat.css'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({
            message: 'CSS minification completed..'
        }));
});

gulp.task('build', [ 'css', 'js' ]);