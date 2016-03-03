var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');

gulp.task('sass', function () {
    gulp.src('public/css/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function () {
    gulp.run('sass');

    gulp.watch('public/css/*.scss', function () {
        gulp.run('sass');
    });
});

gulp.task('default', function () {
    gulp.run('watch');
});