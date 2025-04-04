'use strict'

var gulp = require('gulp');
var replace = require('gulp-replace');
var injectPartials = require('gulp-inject-partials');
var inject = require('gulp-inject');
var merge = require('merge-stream');'use strict'


/* inject partials like sidebar and navbar */
gulp.task('injectPartial', function () {
  return gulp.src("./**/*.html", { base: "./" })
    .pipe(injectPartials())
    .pipe(gulp.dest("."));
});

/* inject Js and CCS assets into HTML */
gulp.task('injectCommonAssets', function () {
  return gulp.src('./**/*.html')
    .pipe(inject(gulp.src([ 
        './assets/vendors/typicons.font/font/typicons.css',
        './assets/vendors/mdi/css/materialdesignicons.min.css',
        './assets/vendors/css/vendor.bundle.base.css', 
        './assets/vendors/js/vendor.bundle.base.js',
    ], {read: false}), {name: 'base', relative: true}))
    .pipe(inject(gulp.src([
        './assets/css/*.css', 
        './assets/js/off-canvas.js', 
        './assets/js/hoverable-collapse.js', 
        './assets/js/template.js',
        './assets/js/settings.js', 
        './assets/js/todolist.js'
    ], {read: false}), {relative: true}))
    .pipe(gulp.dest('.'));
});


/* inject Js and CCS assets into HTML */
gulp.task('injectLayoutStyles', function () {
    var verticalLightStream = gulp.src(['./**/vertical-default-light/**/*.html',
            './**/vertical-boxed/**/*.html',
            './**/vertical-compact/**/*.html',
            './**/vertical-dark-sidebar/**/*.html',
            './**/vertical-fixed/**/*.html',
            './**/vertical-hidden-toggle/**/*.html',
            './**/vertical-icon-menu/**/*.html',
            './**/vertical-toggle-overlay/**/*.html',
            './index.html'])
        .pipe(inject(gulp.src([
            './assets/css/vertical-layout-light/style.css', 
        ], {read: false}), {relative: true}))
        .pipe(gulp.dest('.'));
    var horizontalLightStream = gulp.src('./**/horizontal-default-light/**/*.html')
        .pipe(inject(gulp.src([
            './assets/css/horizontal-layout-light/style.css', 
        ], {read: false}), {relative: true}))
        .pipe(gulp.dest('.'));
    var horizontalDarkStream = gulp.src('./**/horizontal-default-dark/**/*.html')
        .pipe(inject(gulp.src([
            './assets/css/horizontal-layout-dark/style.css',
        ], {read: false}), {relative: true}))
        .pipe(gulp.dest('.'));
    var verticalDarkStream = gulp.src('./**/vertical-default-dark/**/*.html')
        .pipe(inject(gulp.src([
            './assets/css/vertical-layout-dark/style.css', 
        ], {read: false}), {relative: true}))
        .pipe(gulp.dest('.'));
    return merge(verticalLightStream, horizontalLightStream, horizontalDarkStream, verticalDarkStream);
});


/*replace image path and linking after injection*/
gulp.task('replacePath', function () {
    var replacePath1 = gulp.src(['./themes/*/pages/*/*.html'], { base: "./" })
        .pipe(replace('="../../../assets/images/', '="../../../../assets/images/'))
        .pipe(replace('href="../pages/', 'href="../../pages/'))
        .pipe(replace('="../../../docs/', '="../../../../docs/'))
        .pipe(replace('href="../index.html"', 'href="../../index.html"'))
        .pipe(gulp.dest('.'));
    var replacePath2 = gulp.src(['./themes/*/pages/*.html'], { base: "./" })
        .pipe(replace('="../../../assets/images/', '="../../../../assets/images/'))
        .pipe(replace('"../pages/', '"../../pages/'))
        .pipe(replace('href="../index.html"', 'href="../../../index.html"'))
        .pipe(gulp.dest('.'));
    var replacePath3 = gulp.src(['./themes/**/index.html'], { base: "./" })
        .pipe(replace('="../../../assets/images/', '="../../assets/images/'))
        .pipe(replace('="../pages/', '="./pages/'))
        .pipe(replace('="../../../docs/', '="../../docs/'))
        .pipe(replace('="../index.html"', '="index.html"'))
        .pipe(gulp.dest('.'));
    return merge(replacePath1, replacePath2, replacePath3);
});

/*sequence for injecting partials and replacing paths*/
gulp.task('inject', gulp.series('injectPartial', 'injectCommonAssets', 'injectLayoutStyles', 'replacePath'));

gulp.task('replacePaths', function() {
        var replacePath1 = gulp.src(['./themes/*/pages/*/*.html'], { base: "./" })
        .pipe(replace('="../../../../vendors/', '="../../../../assets/vendors/'))
        .pipe(replace('="../../../../images/', '="../../../../assets/images/'))
        .pipe(replace('="../../../../js/', '="../../../../assets/js/'))
        .pipe(replace('="../../../../css/', '="../../../../assets/css/'))
        .pipe(gulp.dest('.'));
    var replacePath2 = gulp.src(['./themes/*/partials/*.html'], { base: "./" })
        .pipe(replace('="images/', '="../../../assets/images/'))
        .pipe(replace('"pages/', '"../pages/'))
        .pipe(replace('href="index.html"', 'href="../index.html"'))
        .pipe(gulp.dest('.'));
    var replacePath3 = gulp.src(['./themes/**/index.html'], { base: "./" })
        .pipe(replace('="../../vendors/', '="../../assets/vendors/'))
        .pipe(replace('="../../images/', '="../../assets/images/'))
        .pipe(replace('="../../css/', '="../../assets/css/'))
        .pipe(replace('="../../js/', '="../../assets/js/'))
        // .pipe(replace('="../../../assets/images/', '="../../assets/images/'))
        // .pipe(replace('="../index.html"', '="index.html"'))
        .pipe(gulp.dest('.'));
    return merge(replacePath1, replacePath2, replacePath3);

})