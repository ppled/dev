const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const stylus = require('gulp-stylus')

function buildCSS () {
  return gulp.src('src/*.styl')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(stylus())
      .pipe(autoprefixer())
      .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets'))
}

function watch () {
  if (process.argv[3] === '--watch') {
    gulp.watch('src/**/*.styl', ['build:css'])
  }
}

gulp.task('build:css', buildCSS)
gulp.task('build', ['build:css'], watch)
