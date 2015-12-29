var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var clean = require("gulp-clean");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");
var addsrc = require("gulp-add-src");
var clone = require("gulp-clone");
var rollup = require("gulp-rollup");
var babel = require("gulp-babel");
var debug = require("gulp-debug");
var runSequence = require("gulp-run-sequence");
var merge = require("merge-stream");

gulp.task("ts", function () {
    return gulp.src("src/**/*.ts")
        .pipe(ts(tsProject))
        .pipe(gulp.dest("build/temp"))
})

gulp.task("js", function () {
    var js = gulp.src("build/temp/sekvens.js", { read: false })
        .pipe(rollup({}))
        .pipe(debug())
        .pipe(babel({modules: "umd"}));

    var global = js.pipe(clone())
        .pipe(addsrc.prepend("src/global-wrapper-prefix.js"))
        .pipe(addsrc.append("src/global-wrapper-suffix.js"))
        .pipe(concat("."))
        .pipe(gulp.dest("build/sekvens-global.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/sekvens-global.min.js"));

    var umd = js.pipe(clone())
        .pipe(concat("."))
        .pipe(gulp.dest("build/sekvens.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/sekvens.min.js"));
        
    return merge(global, umd);
})

gulp.task("temp-js-clean", function () {
    return gulp.src("build/temp")
        .pipe(clean({ force: true }))
})

gulp.task("default", function () {
    runSequence("ts", "js", "temp-js-clean");
})

gulp.task("watch", function () {
    gulp.watch("src/**/*.ts", ["default"]);
})

gulp.task("clean", function () {
    return gulp.src("build/**/*")
        .pipe(clean());
});