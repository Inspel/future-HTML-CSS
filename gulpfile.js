"use strict";

let gulp = require("gulp");
let less = require("gulp-less");
let plumber = require("gulp-plumber");
let postcss = require("gulp-postcss");
let autoprefixer = require("autoprefixer");
let minify = require("gulp-csso");
let uglify = require('gulp-uglify-es').default;
let imagemin = require("gulp-imagemin");
let webp = require("gulp-webp");
let rename = require("gulp-rename");
let del = require("del");
let server = require("browser-sync").create();
let run = require("run-sequence");

gulp.task("style", function() {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("compress", function () {
  return gulp.src("source/js/*.js")
    .pipe(gulp.dest("build/js"))
    // .pipe(rename('*.min.js'))
    // .pipe(uglify())
    // .pipe(gulp.dest("build/js"))
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{jpg, png}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/pic-*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/css/*.css",
    "source/fonts/*.otf",
    "source/img/*.{jpg,png}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build")
});

gulp.task("build", function (done) {
  run(
    "clean",
    "html",
    "images",
    "webp",
    "copy",
    "style",
    "compress",
    done
  );
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", ["style"]);
  gulp.watch("source/js/*.js", ["compress"]);
  gulp.watch("source/*.html").on("change", server.reload);
  gulp.watch("source/*html", ["html"]);
});
