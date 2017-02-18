const addsrc = require("gulp-add-src");
const babel = require("gulp-babel");
const clean = require("gulp-clean");
const clone = require("gulp-clone");
const concat = require("gulp-concat");
const debug = require("gulp-debug");
const gulp = require("gulp");
const merge = require("merge-stream");
const replace = require('gulp-replace');
const rollup = require("gulp-rollup");
const runSequence = require("gulp-run-sequence");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");

const tsProject = ts.createProject("./tsconfig.json");

gulp.task("ts", () => {
  return gulp.src("src/**/*.ts")
    .pipe(ts(tsProject))
    .pipe(gulp.dest("build/temp"))
})

gulp.task("js", () => {
  const js = gulp.src("build/temp/sekvens.js", { read: false })
    .pipe(rollup({ entry: "./sekvens.js" }))
    .pipe(babel({ modules: "umd" }));

  const global = js.pipe(clone())
    .pipe(addsrc.prepend("src/global-wrapper-prefix.js"))
    .pipe(addsrc.append("src/global-wrapper-suffix.js"))
    .pipe(concat("."))
    .pipe(gulp.dest("build/sekvens-global.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/sekvens-global.min.js"));

  const umd = js.pipe(clone())
    .pipe(concat("."))
    .pipe(gulp.dest("build/sekvens.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/sekvens.min.js"));

  return merge(global, umd);
})

gulp.task("temp-js-clean", () => {
  return gulp.src("build/temp")
    .pipe(clean({ force: true }))
})

gulp.task("default", () => {
  runSequence("ts", "js", "temp-js-clean");
})

gulp.task("watch", () => {
  gulp.watch("src/**/*.ts", ["default"]);
})

gulp.task("clean", () => {
  return gulp.src("build/**/*")
    .pipe(clean());
});
