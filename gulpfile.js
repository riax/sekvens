var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var clean = require("gulp-clean");
var ts = require("gulp-typescript");

var tsProject = ts.createProject("./tsconfig.json");

gulp.task("default", function () {
    var result = gulp.src("src/**/*.ts")
        .pipe(ts(tsProject));

    result.dts.pipe(gulp.dest("build"))
    result.js.pipe(concat("sekvens.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build"))
    result.js.pipe(concat("sekvens.js"))
        .pipe(gulp.dest("build"))
})

gulp.task("watch", function () {
    gulp.watch("src/**/*.ts", ["default"]);
})

gulp.task("clean", function () {
    return gulp.src("build/**/*")
        .pipe(clean());
});