var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var clean = require("gulp-clean");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");
var addsrc = require("gulp-add-src");
var clone = require('gulp-clone');

gulp.task("default", function () {
    var result = gulp.src("src/**/*.ts").pipe(ts(tsProject));
    result.js.pipe(clone())
        .pipe(concat("."))
        .pipe(gulp.dest("build/sekvens.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/sekvens.min.js"))
       
    result.js.pipe(clone())
        .pipe(addsrc.prepend("src/global-wrapper-prefix.js"))
        .pipe(addsrc.append("src/global-wrapper-suffix.js"))
        .pipe(concat("."))
        .pipe(gulp.dest("build/sekvens-global.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/sekvens-global.min.js"))
        
    result.dts.pipe(gulp.dest("build"))
})

gulp.task("watch", function () {
    gulp.watch("src/**/*.ts", ["default"]);
})

gulp.task("clean", function () {
    return gulp.src("build/**/*")
        .pipe(clean());
});