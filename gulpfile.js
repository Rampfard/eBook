const { src, dest, watch, parallel, series } = require('gulp');

const scss         = require('gulp-sass');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const browserSync  = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const del          = require('del');
const webpack      = require('webpack-stream');

const dist = './dist';

function browsersync() {
    browserSync.init({
        server : {
            baseDir: dist
        }
    });
}

function cleanDist() {
    return del(dist);
}

function copyHTML() {
    return src("src/index.html")
                .pipe(dest(dist))
                .pipe(browserSync.stream());
}

function copyImages() {
    return src("src/images/**/*")
                .pipe(dest(`${dist}/images`))
                .pipe(browserSync.stream());
}

function copyFonts() {
    return src("src/fonts/**/*")
                .pipe(dest(`${dist}/fonts`))
                .pipe(browserSync.stream());
}

function images() {
    return src('src/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]
        ))
        .pipe(dest(`${dist}/images`));
}

function buildJs() {
    return  src("src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(dest(`${dist}/js`))
                .on("end", browserSync.reload);
}

function prodJs() {
    return src("./src/js/main.js")
            .pipe(webpack({
                mode: 'production',
                output: {
                    filename: 'script.js'
                },
                module: {
                    rules: [
                      {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                          loader: 'babel-loader',
                          options: {
                            presets: [['@babel/preset-env', {
                                corejs: 3,
                                useBuiltIns: "usage"
                            }]]
                          }
                        }
                      }
                    ]
                  }
            }))
            .pipe(dest(`${dist}/js`));
}

function css() {
    return src([
        'node_modules/normalize.css/normalize.css'
    ])
    .pipe(concat('_libs.scss'))
    .pipe(dest('src/scss'))
    .pipe(browserSync.stream());
}

function styles() {
    return src('src/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserlist: ['last 10 versions'],
            cascade: false,
            grid: true
        }))
        .pipe(dest(`${dist}/css`))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/js/**/*.js', '!src/js/main.min.js'], buildJs);
    watch(['src/*.html']).on('change', copyHTML);
    watch(['src/images/**/*.*'], copyImages);
}




exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.buildJs = buildJs;
exports.prodJs = prodJs;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, styles, copyImages, prodJs, copyHTML);
exports.default = parallel(css, styles, buildJs, copyHTML, copyImages, copyFonts, browsersync, watching);