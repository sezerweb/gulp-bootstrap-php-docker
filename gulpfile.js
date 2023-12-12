const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const headerComment = require('gulp-header-comment');
const fileinclude = require("gulp-file-include");
const rimraf = require('gulp-rimraf');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const rename = require("gulp-rename");

const path = {
    src: {
        main: './src/',
        html: "./src/**/*.html",
        others: "./src/*.+(php|ico|png|htaccess|xml)",
        htminc: "./src/partials/**/*.htm",
        incdir: "./src/partials/",
        plugins: "./src/plugins/**/*.*",
        js: [
            './src/js/common.js', 
            './src/js/homepage.js',
            './src/js/vendor/*.js'
        ],
        scss: "./src/scss/*.scss",
        images: "./src/images/**/*.+(png|jpg|gif|svg)",
        folders: ['data', 'files'],
    },
    build: {
        dirDev: "./dev/",
        dirBuild: "./build/",
    },
};


var isBuild = false;

function isBuildSet(cb) {
    isBuild = true;
    cb();
}


function cleanTask(cb) {
    gulp.src(gulpif(isBuild, path.build.dirBuild, path.build.dirDev))
        .pipe(rimraf({ force: true }));
    cb();
}


function htmlTask(cb) {
    gulp.src(path.src.html)
        .pipe(
            fileinclude({
                basepath: path.src.incdir,
            })
        )
        .pipe(gulpif(isBuild, headerComment(` 
            webmaster: https://sezerweb.com
        `)))
        .pipe(gulpif(isBuild, htmlmin({ collapseWhitespace: true })))
        .pipe(gulpif(isBuild, gulp.dest(path.build.dirBuild), gulp.dest(path.build.dirDev)))
        .pipe(browserSync.stream());
    cb();
}

function imageminTask(cb) {
    gulp.src(path.src.images)
        .pipe(gulpif(isBuild, imagemin()))
        .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild + 'images/', path.build.dirDev + 'images/')));
    cb();
}

function _bootstrapJsTask(cb) {
    gulp.src(gulpif(isBuild, [
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    ], [
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map'
    ]))
        .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild + 'plugins/bootstrap', path.build.dirDev + 'plugins/bootstrap')));
    cb();
}

function bootstrapJsTask(cb) {
    gulp.src([
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    ])
        .pipe(gulp.dest(path.src.main + 'js/vendor'));
    cb();
}

function jsTask(cb) {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('sezerweb.js'))
        .pipe(gulpif(isBuild, uglify()))
        .pipe(gulpif(!isBuild, sourcemaps.write('.')))
        .pipe(gulpif(isBuild, headerComment(` 
            webmaster: https://sezerweb.com
        `)))
        .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild + 'js/', path.build.dirDev + 'js/')))
        .pipe(browserSync.stream());
    cb();
}

function folderCopy(cb) {
    const folders = path.src.folders;
    folders.map(function (folder) {
        return gulp.src([path.src.main + folder + '/**/*'])
            .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild + folder, path.build.dirDev + folder)));
    });
    cb();
}

function bootstrapIconTask1(cb) {
    gulp.src([
        './node_modules/bootstrap-icons/font/bootstrap-icons.scss'
    ])
        .pipe(rename('_bootstrap-icons.scss'))
        .pipe(gulp.dest(path.src.main + 'scss'));
    cb();
}

function bootstrapIconTask2(cb) {
    gulp.src([
        './node_modules/bootstrap-icons/font/fonts/**/*',
    ])
        .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild + 'css/fonts', path.build.dirDev + 'css/fonts')));
    cb();
}


function bootstrapCssTask(cb) {
    gulp.src([
        './node_modules/bootstrap/scss/**/*',
    ])
        .pipe(gulp.dest(path.src.main + 'scss/bootstrap'));
    cb();
}

function sassTask(cb) {
    gulp.src(path.src.scss)
        .pipe(gulpif(!isBuild, sourcemaps.init()))
        .pipe(sass(gulpif(isBuild, { outputStyle: 'compressed' })).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulpif(isBuild, headerComment(` 
            webmaster: https://sezerweb.com
        `)))
        .pipe(gulpif(!isBuild, sourcemaps.write('.')))
        .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild + 'css/', path.build.dirDev + 'css/')));
    cb();
}

function otherTask(cb) {
    gulp.src(path.src.others)
        .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild, path.build.dirDev)));
    cb();
}


function pluginsTask(cb) {
    gulp.src(path.src.plugins)
        .pipe(gulp.dest(gulpif(isBuild, path.build.dirBuild + 'plugins/', path.build.dirDev + 'plugins/')));
    cb();
}

function browsersyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: path.build.dirDev
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browserSync.reload();
    cb();
}

function watchTask() {
    gulp.watch(path.src.html, gulp.series(htmlTask, browsersyncReload));
    gulp.watch(path.src.htminc, gulp.series(htmlTask, browsersyncReload));
    gulp.watch(path.src.js, gulp.series(jsTask, browsersyncReload));
    gulp.watch(path.src.images, gulp.series(imageminTask, browsersyncReload));
    gulp.watch(path.src.scss, gulp.series(sassTask, browsersyncReload));
    gulp.watch(path.src.others, gulp.series(otherTask, browsersyncReload));
}

exports.default = gulp.series(
    cleanTask,
    htmlTask,
    folderCopy,
    imageminTask,
    bootstrapIconTask1,
    bootstrapIconTask2,
    bootstrapCssTask,
    sassTask,
    bootstrapJsTask,
    jsTask,
    otherTask,
    pluginsTask,
    browsersyncServe,
    watchTask,
);


exports.build = gulp.series(
    isBuildSet,
    cleanTask,
    htmlTask,
    folderCopy,
    imageminTask,
    bootstrapIconTask1,
    bootstrapIconTask2,
    bootstrapCssTask,
    sassTask,
    bootstrapJsTask,
    jsTask,
    otherTask,
    pluginsTask
);