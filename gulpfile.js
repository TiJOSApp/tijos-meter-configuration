let gulp = require('gulp');
let runSequence = require('run-sequence');
let autoprefixer = require('gulp-autoprefixer');
let sass = require('gulp-sass');
let cssSrc = ['src/css/*.scss'];
let babel = require("gulp-babel");
let jsSrc = ['src/js/*.js'];
gulp.task('copy',  function() {
    return gulp.src(['src/**/*','!src/css/**','!src/js/**'],{ base: 'src' })
        .pipe(gulp.dest('www'))
});

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function () {
    return gulp.src(cssSrc)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest('www/css'));
});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function () {
    return gulp.src(jsSrc)
        .pipe(babel({
            presets: ['env']
        })).pipe(gulp.dest('www/js'));
});

//开发构建
gulp.task('dev', function (done) {
    runSequence(
        ['copy'],
        ['revCss'],
        ['revJs'], done);
});



