var gulp = require("gulp");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify");
var uglify = require("gulp-uglify");
var clean = require("gulp-clean");
var ts = require("gulp-typescript");
var wrap = require("gulp-wrap-amd");

var tsProject = ts.createProject("./tsconfig.json");

gulp.task("release", function () {
    var result = gulp.src("src/**/*.ts")
        .pipe(ts(tsProject));

    result.dts.pipe(gulp.dest("build"))
    result.js.pipe(concat("sekvens.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build"))
    result.js.pipe(concat("sekvens.js"))
        .pipe(gulp.dest("build"))
})

gulp.task("default", function () {
    gulp.watch("src/**/*.ts", ["release"]);
})

gulp.task("clean", function () {
    return gulp.src("build/**/*")
        .pipe(clean());
});